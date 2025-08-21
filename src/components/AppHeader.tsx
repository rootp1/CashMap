import { Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface AppHeaderProps {
  title: string;
  showNotifications?: boolean;
  onNotificationClick?: () => void;
}

export function AppHeader({ title, showNotifications = true, onNotificationClick }: AppHeaderProps) {
  return (
    <header className="relative flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/15 via-success/15 to-warning/15 backdrop-blur-md">
      <div className="w-10 flex">
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
      <h1 className="text-lg font-semibold text-gradient-green tracking-wide drop-shadow-sm">{title}</h1>
      <div className="relative">
        <Avatar className="h-9 w-9 ring-2 ring-primary/50 hover:ring-success/60 transition">
          <AvatarFallback className="bg-gradient-to-br from-primary to-success text-primary-foreground text-sm flex items-center justify-center">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
        <div className="absolute -inset-1 rounded-full blur-md opacity-35 bg-gradient-to-r from-primary via-success to-warning pointer-events-none" />
      </div>
    </header>
  );
}