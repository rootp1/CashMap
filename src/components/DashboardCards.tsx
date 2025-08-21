import { TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface DashboardCardsProps {
  daySpend: number;
  remaining: number;
  dailyLimit: number;
  selectedDate: string;
  sevenDayTrend: number[];
  topCategory: { category: { name: string; iconKey: string }; amount: number } | null;
  percentageSpent?: number; // for syncing colors with gauge
}

export function DashboardCards({
  daySpend,
  remaining,
  dailyLimit,
  selectedDate,
  sevenDayTrend,
  topCategory,
  percentageSpent
}: DashboardCardsProps) {
  // Derive status like gauge for consistent coloring
  const status = (() => {
    if (percentageSpent === undefined) return 'success';
    if (percentageSpent >= 70) return 'danger';
    if (percentageSpent > 50) return 'warning';
    return 'success';
  })();
  const statusTextClass = status === 'danger' ? 'text-danger' : status === 'warning' ? 'text-warning' : 'text-success';
  const gradientValueClass = status === 'danger'
    ? 'bg-gradient-to-r from-danger via-danger to-danger bg-clip-text text-transparent'
    : status === 'warning'
      ? 'bg-gradient-to-r from-warning via-warning to-warning bg-clip-text text-transparent'
      : 'text-gradient-green';
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
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

  const getIconForCategory = (iconKey: string) => {
    switch (iconKey) {
      case 'Car': return '🚗';
      case 'Utensils': return '🍽️';
      case 'ShoppingBag': return '🛍️';
      case 'ShoppingCart': return '🛒';
      default: return '📋';
    }
  };

  const Sparkline = ({ data }: { data: number[] }) => {
    const max = Math.max(...data, 100);
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - (value / max) * 16;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="text-primary">
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {data.map((_, index) => {
          const x = (index / (data.length - 1)) * 60;
          const y = 20 - (data[index] / max) * 16;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="2"
              fill="currentColor"
            />
          );
        })}
      </svg>
    );
  };

  return (
    <div className="grid grid-cols-2 gap-4 px-4 pb-6">
      {/* Day's Spend */}
      <Card className="relative overflow-hidden glass-green shimmer-border-green lift-green">
        <div className="green-bar absolute top-0 left-0 w-full" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">Day's Spend</h3>
            <TrendingDown className="h-4 w-4 text-danger" />
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold currency ${gradientValueClass}`}>
              {formatCurrency(daySpend)}
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              on {formatDate(selectedDate)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Remaining Allowance */}
      <Card className="relative overflow-hidden glass-green shimmer-border-green lift-green">
        <div className="green-bar absolute top-0 left-0 w-full" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">Remaining</h3>
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="space-y-1">
            <p className={`text-2xl font-bold currency ${gradientValueClass}`}>
              {formatCurrency(remaining)}
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              of {formatCurrency(dailyLimit)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* 7-Day Trend */}
      <Card className="relative overflow-hidden glass-green shimmer-border-green lift-green">
        <div className="green-bar absolute top-0 left-0 w-full" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">7-Day Trend</h3>
            <div className="opacity-90">
              <Sparkline data={sevenDayTrend} />
            </div>
          </div>
          <div className="space-y-1">
            <p className={`text-lg font-bold ${gradientValueClass}`}>
              {sevenDayTrend[sevenDayTrend.length - 1]}%
            </p>
            <p className="text-[11px] text-muted-foreground/70">
              avg daily spend
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Top Category */}
      <Card className="relative overflow-hidden glass-green shimmer-border-green lift-green">
        <div className="green-bar absolute top-0 left-0 w-full" />
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground/80">Top Category</h3>
            {topCategory && (
              <span className="text-base font-semibold ml-2 inline-flex items-center gap-1 pr-1">
                <span>{getIconForCategory(topCategory.category.iconKey)}</span>
              </span>
            )}
          </div>
          <div className="space-y-1">
            {topCategory ? (
              <>
                <p className={`text-lg font-bold leading-tight ${gradientValueClass}`}>
                  {topCategory.category.name}
                </p>
                <p className="text-[11px] text-muted-foreground/70 currency">
                  {formatCurrency(topCategory.amount)}
                </p>
              </>
            ) : (
              <>
                <p className="text-lg font-bold text-muted-foreground">—</p>
                <p className="text-[11px] text-muted-foreground/70">No spending yet</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}