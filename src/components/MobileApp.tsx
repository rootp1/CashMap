import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import { BottomNavigation } from './BottomNavigation';
import { AppHeader } from './AppHeader';
import { NotificationTray } from './NotificationTray';
import { CategorizationNotification } from './CategorizationNotification';
import { Dashboard } from '@/pages/Dashboard';
import { PaymentsHistory } from '@/pages/PaymentsHistory';
import { Community } from '@/pages/Community';
import { Settings } from '@/pages/Settings';
import { useAppState } from '@/hooks/useAppState';

export function MobileApp() {
  const { state, updateState, updateTransaction } = useAppState();

  const handleCategorySelect = (categoryId: string) => {
    if (state.showCategorization.transaction) {
      updateTransaction(state.showCategorization.transaction.id, {
        categoryId,
        categorySource: 'notification',
      });
    }
    
    updateState({
      showCategorization: { show: false },
    });
  };

  const handleDismissNotification = () => {
    updateState({
      showCategorization: { show: false },
    });
  };

  const [trayOpen, setTrayOpen] = useState(false);
  const latestUncategorized = state.transactions.find(t => t.categoryId === null);

  return (
    <div className="h-full flex flex-col bg-background relative">
      <AppHeader title="CashMap" onNotificationClick={() => setTrayOpen(o => !o)} />
      <NotificationTray
        open={trayOpen}
        onClose={() => setTrayOpen(false)}
        categories={state.categories}
        latestUncategorized={latestUncategorized || null}
        onSelectCategory={(id) => {
          if (latestUncategorized) {
            updateTransaction(latestUncategorized.id, { categoryId: id, categorySource: 'notification' });
          }
          setTrayOpen(false);
        }}
        remaining={Math.max(0, state.settings.dailyLimit - state.transactions.filter(t => t.date === state.selectedDate && t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0))}
      />
      {/* Categorization Notification */}
      {state.showCategorization.show && state.showCategorization.transaction && (
        <div className="absolute top-0 left-0 right-0 z-50 pt-4">
          <CategorizationNotification
            transaction={state.showCategorization.transaction}
            categories={state.categories}
            onSelectCategory={handleCategorySelect}
            onDismiss={handleDismissNotification}
          />
        </div>
      )}

      {/* Main Content */}
  <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/history" element={<PaymentsHistory />} />
          <Route path="/community" element={<Community />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>

      {/* Bottom Navigation */}
  <BottomNavigation onBellClick={() => setTrayOpen(o => !o)} />
    </div>
  );
}