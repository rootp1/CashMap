import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Transaction, Category } from '@/types';

interface CategorizationNotificationProps {
  transaction: Transaction;
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
  onDismiss: () => void;
}

export function CategorizationNotification({
  transaction,
  categories,
  onSelectCategory,
  onDismiss
}: CategorizationNotificationProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(amount));
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

  return (
    <Card className="mx-4 mb-4 p-4 bg-primary-muted border-primary shadow-lg">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1">
            {formatCurrency(transaction.amount)} at {transaction.merchant}
          </h3>
          <p className="text-sm text-muted-foreground">Pick a category</p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onDismiss}
          className="h-8 w-8 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {categories.slice(0, 4).map((category) => (
            <Button
              key={category.id}
              variant="outline"
              size="sm"
              onClick={() => onSelectCategory(category.id)}
              className="flex items-center space-x-2 justify-start touch-target"
            >
              <span>{getIconForCategory(category.iconKey)}</span>
              <span className="text-sm">{category.name}</span>
            </Button>
          ))}
        </div>
        
        {categories.length > 4 && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSelectCategory(categories[4].id)}
              className="flex items-center space-x-2 touch-target"
            >
              <span>{getIconForCategory(categories[4].iconKey)}</span>
              <span className="text-sm">{categories[4].name}</span>
            </Button>
          </div>
        )}
        
        <div className="flex justify-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="text-muted-foreground hover:text-foreground"
          >
            Later
          </Button>
        </div>
      </div>
    </Card>
  );
}