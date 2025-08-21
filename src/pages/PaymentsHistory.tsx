import { useState } from 'react';
import { Clock } from 'lucide-react';
import { AppHeader } from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppState } from '@/hooks/useAppState';
import { format, isToday, isYesterday } from 'date-fns';

export function PaymentsHistory() {
  const { state, updateTransaction } = useAppState();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const formatCurrency = (amount: number) => {
    const prefix = amount < 0 ? '−' : '+';
    return prefix + new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
  };

  const formatTime = (timestamp: string) => {
    return format(new Date(timestamp), 'HH:mm');
  };

  const formatDateGroup = (date: string) => {
    const dateObj = new Date(date);
    if (isToday(dateObj)) return 'Today';
    if (isYesterday(dateObj)) return 'Yesterday';
    return format(dateObj, 'dd MMM yyyy');
  };

  const getIconForCategory = (iconKey: string) => {
    switch (iconKey) {
      case 'Car': return '🚗';
      case 'Utensils': return '🍽️';
      case 'ShoppingBag': return '🛍️';
      case 'ShoppingCart': return '🛒';
      default: return '📋';
    }
  };

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return null;
    return state.categories.find(c => c.id === categoryId)?.name;
  };

  const getCategoryIcon = (categoryId: string | null) => {
    if (!categoryId) return '❓';
    const category = state.categories.find(c => c.id === categoryId);
    return category ? getIconForCategory(category.iconKey) : '❓';
  };

  // Filter transactions
  const filteredTransactions = state.transactions.filter(transaction => {
    if (selectedFilter === 'All') return true;
    const categoryName = getCategoryName(transaction.categoryId);
    return categoryName === selectedFilter;
  });

  // Group transactions by date
  const groupedTransactions = filteredTransactions.reduce((groups, transaction) => {
    const date = transaction.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(transaction);
    return groups;
  }, {} as Record<string, typeof filteredTransactions>);

  // Sort dates (newest first)
  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  const handleCategorySelect = (transactionId: string, categoryId: string) => {
    updateTransaction(transactionId, {
      categoryId,
      categorySource: 'inline_list',
    });
  };

  const filterChips = ['All', ...state.categories.map(c => c.name)];

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Payments History" />
      
  <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {/* Filter Chips */}
        <div className="px-4 py-3 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {filterChips.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter)}
                className="text-xs"
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>

        {/* Transactions List */}
        <div className="space-y-6 p-4">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground mb-2">
                No transactions yet
              </p>
              <p className="text-sm text-muted-foreground">
                Tap 'Simulate SMS' on Dashboard to add some transactions
              </p>
            </div>
          ) : (
            sortedDates.map((date) => (
              <div key={date} className="space-y-3">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  {formatDateGroup(date)}
                </h3>
                
                <div className="space-y-3">
                  {groupedTransactions[date]
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((transaction) => {
                      const categoryName = getCategoryName(transaction.categoryId);
                      const categoryIcon = getCategoryIcon(transaction.categoryId);
                      
                      return (
                        <div
                          key={transaction.id}
                          className="flex items-center space-x-3 p-3 bg-card rounded-lg border border-border"
                        >
                          <div className="flex-shrink-0 text-2xl">
                            {categoryIcon}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium text-foreground truncate">
                                  {transaction.merchant}
                                </p>
                                
                                {categoryName ? (
                                  <Badge variant="secondary" className="mt-1 text-xs">
                                    {categoryName}
                                  </Badge>
                                ) : (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {state.categories.slice(0, 4).map((category) => (
                                      <Button
                                        key={category.id}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCategorySelect(transaction.id, category.id)}
                                        className="text-xs h-7 px-2"
                                      >
                                        <span className="mr-1">{getIconForCategory(category.iconKey)}</span>
                                        {category.name}
                                      </Button>
                                    ))}
                                    {state.categories.length > 4 && (
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleCategorySelect(transaction.id, state.categories[4].id)}
                                        className="text-xs h-7 px-2"
                                      >
                                        <span className="mr-1">{getIconForCategory(state.categories[4].iconKey)}</span>
                                        {state.categories[4].name}
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>
                              
                              <div className="text-right ml-3">
                                <p className={`font-semibold currency ${
                                  transaction.amount < 0 ? 'text-danger' : 'text-success'
                                }`}>
                                  {formatCurrency(transaction.amount)}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  {formatTime(transaction.timestamp)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}