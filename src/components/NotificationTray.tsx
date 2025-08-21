import { BatteryFull, Wifi, SignalHigh, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Category, Transaction } from '@/types';

interface NotificationTrayProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  latestUncategorized: Transaction | null;
  onSelectCategory: (categoryId: string) => void;
  remaining: number;
}

export function NotificationTray({ open, onClose, categories, latestUncategorized, onSelectCategory, remaining }: NotificationTrayProps) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  const dateStr = time.toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short' });

  const iconFor = (iconKey: string) => {
    switch (iconKey) {
      case 'Car': return '🚗';
      case 'Utensils': return '🍽️';
      case 'ShoppingBag': return '🛍️';
      case 'ShoppingCart': return '🛒';
      default: return '📋';
    }
  };

  return (
    <div className={`pointer-events-none absolute inset-0 z-50 transition-transform duration-300 ease-out ${open ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="pointer-events-auto h-full bg-[rgba(28,28,28,0.88)] backdrop-blur-md text-white shadow-xl flex flex-col">
        {/* Status bar clone */}
        <div className="flex items-center justify-between px-4 pt-3 text-[11px] font-medium tracking-wide">
          <div className="flex items-center gap-3">
            <span className="text-red-400 font-semibold">{timeStr}</span>
            <span className="text-white/80">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
            <SignalHigh className="h-4 w-4" />
            <BatteryFull className="h-4 w-4" />
            <button onClick={onClose} className="ml-1 text-white/70 hover:text-white transition" aria-label="Close tray">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-4 px-3 pb-4 overflow-y-auto scrollbar-hidden">
          {latestUncategorized ? (
            <div className="bg-white/95 rounded-xl p-4 text-foreground shadow-inner border border-white/30">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">
                    {Math.abs(latestUncategorized.amount).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })} at {latestUncategorized.merchant}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">Pick a category (Remaining ₹{remaining})</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  {categories.slice(0,4).map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => onSelectCategory(cat.id)}
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-[13px] border border-border bg-muted/70 hover:bg-muted transition-colors text-left"
                    >
                      <span>{iconFor(cat.iconKey)}</span>
                      <span className="truncate">{cat.name}</span>
                    </button>
                  ))}
                </div>
                {categories.length > 4 && (
                  <div className="flex justify-center">
                    <button
                      onClick={() => onSelectCategory(categories[4].id)}
                      className="flex items-center gap-2 rounded-md px-2 py-2 text-[13px] border border-border bg-muted/70 hover:bg-muted transition-colors w-full justify-center"
                    >
                      <span>{iconFor(categories[4].iconKey)}</span>
                      <span className="truncate">{categories[4].name}</span>
                    </button>
                  </div>
                )}
                <div className="flex justify-center pt-1">
                  <button onClick={onClose} className="text-[11px] text-muted-foreground hover:text-foreground px-3 py-1 rounded-md">Later</button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-white/50 text-xs py-10">No uncategorized transaction</p>
          )}
        </div>
      </div>
    </div>
  );
}
