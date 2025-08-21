export interface Category {
  id: string;
  name: string;
  iconKey: string;
  order: number;
  active: boolean;
}

export interface Transaction {
  id: string;
  timestamp: string;
  date: string; // YYYY-MM-DD
  merchant: string;
  amount: number; // negative for expense, positive for credit
  categoryId: string | null;
  categorySource: 'notification' | 'inline_list' | 'uncategorized';
  rawMessage?: string;
}

export interface Settings {
  dailyLimit: number;
  warningThreshold: number; // percentage
  exceededThreshold: number; // percentage
  notifyWarning: boolean;
  notifyExceeded: boolean;
}

export interface AppState {
  selectedDate: string; // YYYY-MM-DD
  settings: Settings;
  categories: Category[];
  transactions: Transaction[];
  showOnboarding: boolean;
  showCategorization: {
    show: boolean;
    transaction?: Transaction;
  };
}