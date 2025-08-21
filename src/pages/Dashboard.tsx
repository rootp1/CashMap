import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpendingGauge } from '@/components/SpendingGauge';
import { AssistantBubble } from '@/components/AssistantBubble';
import { DashboardCards } from '@/components/DashboardCards';
import { useAppState } from '@/hooks/useAppState';
import { format } from 'date-fns';
import { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';

export function Dashboard() {
  const {
    state,
    updateState,
    daySpend,
    remaining,
    percentageSpent,
    getAssistantMessage,
    getSevenDayTrend,
    getTopCategory,
  } = useAppState();

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
        <div className="flex items-stretch gap-3 px-2">
          <div className="flex-1">
            <DashboardCards
              daySpend={daySpend}
              remaining={remaining}
              dailyLimit={state.settings.dailyLimit}
              selectedDate={state.selectedDate}
              sevenDayTrend={getSevenDayTrend()}
              topCategory={getTopCategory()}
              percentageSpent={percentageSpent}
            />
          </div>
          <div className="flex flex-col items-center pr-2 pt-2 w-12">
            <div className="text-[10px] font-medium mb-2 text-center uppercase tracking-wide">Limit</div>
            <div className="h-full flex items-center">
              <Slider
                orientation="vertical"
                value={[state.settings.dailyLimit]}
                min={20}
                max={300}
                step={5}
                className="h-56 w-6 data-[orientation=vertical]:flex-col"
                onValueChange={(val) => updateState({ settings: { ...state.settings, dailyLimit: val[0] } })}
              />
            </div>
            <div className="mt-2 text-xs font-semibold text-center">₹{state.settings.dailyLimit}</div>
          </div>
        </div>
      </div>

    </div>
  );
}