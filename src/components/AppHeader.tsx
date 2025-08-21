import { Bell, BatteryFull, Wifi, SignalHigh } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
// Removed avatar; using app icon + bell per request

interface AppHeaderProps {
  title: string;
  showNotifications?: boolean;
  onNotificationClick?: () => void;
}

export function AppHeader({ title, showNotifications = true, onNotificationClick }: AppHeaderProps) {
  const [time, setTime] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30_000); // update every 30s
    return () => clearInterval(id);
  }, []);
  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <header className="relative px-4 pt-2 pb-3 bg-gradient-to-r from-primary/15 via-success/15 to-warning/15 backdrop-blur-md">
      {/* Status Bar */}
      <div className="flex items-center justify-between text-[11px] font-medium text-foreground/80 leading-none mb-1 select-none">
        <span>{timeStr}</span>
        <div className="flex items-center gap-1.5">
          <SignalHigh className="h-3.5 w-3.5" />
          <Wifi className="h-3.5 w-3.5" />
          <BatteryFull className="h-3.5 w-3.5" />
        </div>
      </div>
      {/* Main Header Row */}
      <div className="flex items-center justify-between">
        <div className="w-10 flex items-center justify-start">
          <img src="/favicon.png" alt="App" className="h-8 w-8 rounded-md shadow-sm object-contain" />
        </div>
        <h1 className="text-lg font-semibold text-gradient-green tracking-wide drop-shadow-sm flex-1 text-center">{title}</h1>
        <div className="w-10 flex items-center justify-end">
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon"
              className="touch-target glow-green"
              onClick={onNotificationClick}
            >
              <Bell className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      {/* Bottom Divider Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border" />
    </header>
  );
}