import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppHeader } from '@/components/AppHeader';
import { SpendingGauge } from '@/components/SpendingGauge';
import { AssistantBubble } from '@/components/AssistantBubble';
import { DashboardCards } from '@/components/DashboardCards';
import { useAppState } from '@/hooks/useAppState';
import { Transaction } from '@/types';
import { format } from 'date-fns';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

export function Dashboard() {
  const {
    state,
    updateState,
    addTransaction,
    daySpend,
    remaining,
    percentageSpent,
    getAssistantMessage,
    getSevenDayTrend,
    getTopCategory,
  } = useAppState();

  const handleSimulateSMS = () => {
    const merchants = ['Starbucks', 'Uber', 'Amazon', 'Swiggy', 'BookMyShow', 'Myntra'];
    const amounts = [150, 250, 380, 120, 500, 200];
    
    const randomMerchant = merchants[Math.floor(Math.random() * merchants.length)];
    const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
    
    const newTransaction: Omit<Transaction, 'id'> = {
      timestamp: new Date().toISOString(),
      date: state.selectedDate,
      merchant: randomMerchant,
      amount: -randomAmount,
      categoryId: null,
      categorySource: 'uncategorized',
      rawMessage: `₹${randomAmount} spent at ${randomMerchant} via UPI`,
    };

    const transaction = addTransaction(newTransaction);
    
    updateState({
      showCategorization: {
        show: true,
        transaction,
      },
    });
  };

  const handleDateSelect = (date: string) => {
    updateState({ selectedDate: date });
  };

  const formatDate = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    if (dateStr === today) return 'Today';
    if (dateStr === yesterday) return 'Yesterday';
    
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short'
    });
  };

  const [calendarOpen, setCalendarOpen] = useState(false);

  const shiftDate = (delta: number) => {
    const d = new Date(state.selectedDate);
    d.setDate(d.getDate() + delta);
    const newDate = format(d, 'yyyy-MM-dd');
    handleDateSelect(newDate);
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader title="Dashboard" />
      
  <div className="flex-1 overflow-y-auto scrollbar-hidden">
        {/* Date Picker Row */}
        <div className="flex justify-end px-4 py-3 gap-2 items-center">
          <Button
            variant="ghost"
            size="sm"
            aria-label="Previous day"
            onClick={() => shiftDate(-1)}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
                aria-label="Pick date"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(state.selectedDate)}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-2" align="end">
              <Calendar
                mode="single"
                selected={new Date(state.selectedDate)}
                onSelect={d => {
                  if (d) {
                    handleDateSelect(format(d, 'yyyy-MM-dd'));
                  }
                  setCalendarOpen(false);
                }}
                fromDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                toDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Next day"
            onClick={() => shiftDate(1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Spending Gauge */}
        <SpendingGauge
          percentage={percentageSpent}
          amount={daySpend}
          limit={state.settings.dailyLimit}
          date={state.selectedDate}
          topCategory={getTopCategory()}
        />

        {/* Assistant Message */}
        <AssistantBubble
          message={getAssistantMessage(percentageSpent)}
          onTipClick={() => {
            // Show tips modal or sheet
            console.log('Show tips');
          }}
        />

        {/* Dashboard Cards */}
        <DashboardCards
          daySpend={daySpend}
          remaining={remaining}
          dailyLimit={state.settings.dailyLimit}
          selectedDate={state.selectedDate}
          sevenDayTrend={getSevenDayTrend()}
          topCategory={getTopCategory()}
        />
      </div>

      {/* Floating Action Button */}
      <div className="absolute bottom-20 right-4">
        <Button
          onClick={handleSimulateSMS}
          className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}