import { BarChart3, Clock, Users, Settings } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
  { id: 'history', label: 'History', icon: Clock, path: '/history' },
  { id: 'community', label: 'Community', icon: Users, path: '/community' },
  { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

export function BottomNavigation() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="bg-background border-t border-border">
      <div className="flex">
        {tabs.map(({ id, label, icon: Icon, path }) => {
          const isActive = location.pathname === path;
          
          return (
            <button
              key={id}
              onClick={() => navigate(path)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-1 touch-target transition-smooth ${
                isActive
                  ? 'text-primary bg-primary-muted'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}