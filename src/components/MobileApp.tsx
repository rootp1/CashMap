import { Routes, Route } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
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

  return (
    <div className="h-full flex flex-col bg-background">
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
      <BottomNavigation />
    </div>
  );
}