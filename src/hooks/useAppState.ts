import { useState, useMemo } from 'react';
import { AppState, Transaction, Category } from '@/types';
import { format } from 'date-fns';

const defaultCategories: Category[] = [
  { id: '1', name: 'Travel', iconKey: 'Car', order: 0, active: true },
  { id: '2', name: 'Food', iconKey: 'Utensils', order: 1, active: true },
  { id: '3', name: 'Shopping', iconKey: 'ShoppingBag', order: 2, active: true },
  { id: '4', name: 'Groceries', iconKey: 'ShoppingCart', order: 3, active: true },
  { id: '5', name: 'Others', iconKey: 'MoreHorizontal', order: 4, active: true },
];

// Seed data
const today = format(new Date(), 'yyyy-MM-dd');
const yesterday = format(new Date(Date.now() - 86400000), 'yyyy-MM-dd');
const twoDaysAgo = format(new Date(Date.now() - 2 * 86400000), 'yyyy-MM-dd');
const threeDaysAgo = format(new Date(Date.now() - 3 * 86400000), 'yyyy-MM-dd');
const fourDaysAgo = format(new Date(Date.now() - 4 * 86400000), 'yyyy-MM-dd');
const fiveDaysAgo = format(new Date(Date.now() - 5 * 86400000), 'yyyy-MM-dd');
const sixDaysAgo = format(new Date(Date.now() - 6 * 86400000), 'yyyy-MM-dd');
const sevenDaysAgo = format(new Date(Date.now() - 7 * 86400000), 'yyyy-MM-dd');
const eightDaysAgo = format(new Date(Date.now() - 8 * 86400000), 'yyyy-MM-dd');
const nineDaysAgo = format(new Date(Date.now() - 9 * 86400000), 'yyyy-MM-dd');

const seedTransactions: Transaction[] = [
  // Today
  { id: '1', timestamp: `${today}T10:45:00`, date: today, merchant: 'Zomato', amount: -25, categoryId: '2', categorySource: 'notification' },
  { id: '2', timestamp: `${today}T09:10:00`, date: today, merchant: 'BMTC', amount: -12, categoryId: null, categorySource: 'uncategorized' },
  { id: '3', timestamp: `${today}T08:32:00`, date: today, merchant: 'Chai Point', amount: -7, categoryId: '2', categorySource: 'notification' },
  { id: '4', timestamp: `${today}T00:15:00`, date: today, merchant: 'Amazon', amount: -130, categoryId: '3', categorySource: 'notification' },
  
  // Yesterday
  { id: '5', timestamp: `${yesterday}T21:40:00`, date: yesterday, merchant: 'Rapido', amount: -35, categoryId: '1', categorySource: 'notification' },
  { id: '6', timestamp: `${yesterday}T19:20:00`, date: yesterday, merchant: 'Myntra', amount: -80, categoryId: '3', categorySource: 'notification' },
  { id: '7', timestamp: `${yesterday}T12:05:00`, date: yesterday, merchant: 'Subway', amount: -22, categoryId: '2', categorySource: 'notification' },
  { id: '8', timestamp: `${yesterday}T07:55:00`, date: yesterday, merchant: 'Namma Metro', amount: -4, categoryId: '1', categorySource: 'notification' },
  
  // Two days ago
  { id: '9', timestamp: `${twoDaysAgo}T23:10:00`, date: twoDaysAgo, merchant: 'BigBazaar', amount: -115, categoryId: '4', categorySource: 'notification' },
  { id: '10', timestamp: `${twoDaysAgo}T18:30:00`, date: twoDaysAgo, merchant: 'Juice Junction', amount: -9, categoryId: '2', categorySource: 'notification' },
  { id: '11', timestamp: `${twoDaysAgo}T10:02:00`, date: twoDaysAgo, merchant: 'BMTC', amount: -6, categoryId: '1', categorySource: 'notification' },
  { id: '12', timestamp: `${twoDaysAgo}T08:18:00`, date: twoDaysAgo, merchant: 'Paytm Movies', amount: -20, categoryId: '5', categorySource: 'notification' },
  
  // Three days ago with refund
  { id: '13', timestamp: `${threeDaysAgo}T22:48:00`, date: threeDaysAgo, merchant: 'Decathlon', amount: -60, categoryId: '3', categorySource: 'notification' },
  { id: '14', timestamp: `${threeDaysAgo}T17:22:00`, date: threeDaysAgo, merchant: 'CCD', amount: -15, categoryId: '2', categorySource: 'notification' },
  { id: '15', timestamp: `${threeDaysAgo}T11:37:00`, date: threeDaysAgo, merchant: 'Reliance Fresh', amount: -38, categoryId: '4', categorySource: 'notification' },
  { id: '16', timestamp: `${threeDaysAgo}T10:15:00`, date: threeDaysAgo, merchant: 'Zomato', amount: 25, categoryId: '2', categorySource: 'notification' },
  { id: '17', timestamp: `${threeDaysAgo}T09:01:00`, date: threeDaysAgo, merchant: 'Auto Rickshaw', amount: -8, categoryId: null, categorySource: 'uncategorized' },
  
  // Continue with remaining days...
  { id: '18', timestamp: `${fourDaysAgo}T20:05:00`, date: fourDaysAgo, merchant: 'Nykaa', amount: -100, categoryId: '3', categorySource: 'notification' },
  { id: '19', timestamp: `${fourDaysAgo}T16:45:00`, date: fourDaysAgo, merchant: 'Tea Stall', amount: -6, categoryId: '2', categorySource: 'notification' },
  { id: '20', timestamp: `${fourDaysAgo}T13:10:00`, date: fourDaysAgo, merchant: 'D-Mart', amount: -27, categoryId: '4', categorySource: 'notification' },
  { id: '21', timestamp: `${fourDaysAgo}T08:25:00`, date: fourDaysAgo, merchant: 'Metro SmartCard', amount: -3, categoryId: '1', categorySource: 'notification' },
  
  { id: '22', timestamp: `${fiveDaysAgo}T21:15:00`, date: fiveDaysAgo, merchant: 'BigBasket', amount: -45, categoryId: '4', categorySource: 'notification' },
  { id: '23', timestamp: `${fiveDaysAgo}T19:05:00`, date: fiveDaysAgo, merchant: 'KFC', amount: -18, categoryId: '2', categorySource: 'notification' },
  { id: '24', timestamp: `${fiveDaysAgo}T15:20:00`, date: fiveDaysAgo, merchant: 'Ajio', amount: -52, categoryId: '3', categorySource: 'notification' },
  { id: '25', timestamp: `${fiveDaysAgo}T11:05:00`, date: fiveDaysAgo, merchant: 'Paytm', amount: 15, categoryId: '5', categorySource: 'notification' },
  { id: '26', timestamp: `${fiveDaysAgo}T09:40:00`, date: fiveDaysAgo, merchant: 'BMTC', amount: -9, categoryId: '1', categorySource: 'notification' },
  
  { id: '27', timestamp: `${sixDaysAgo}T22:30:00`, date: sixDaysAgo, merchant: 'Flipkart', amount: -150, categoryId: '3', categorySource: 'notification' },
  { id: '28', timestamp: `${sixDaysAgo}T18:55:00`, date: sixDaysAgo, merchant: 'Pizza Hut', amount: -21, categoryId: '2', categorySource: 'notification' },
  { id: '29', timestamp: `${sixDaysAgo}T13:00:00`, date: sixDaysAgo, merchant: 'HOPCOMS', amount: -11, categoryId: '4', categorySource: 'notification' },
  { id: '30', timestamp: `${sixDaysAgo}T07:10:00`, date: sixDaysAgo, merchant: 'Namma Metro', amount: -5, categoryId: '1', categorySource: 'notification' },
  
  // Seven days ago (Green - Low spending day)
  { id: '31', timestamp: `${sevenDaysAgo}T19:30:00`, date: sevenDaysAgo, merchant: 'Local Tea Shop', amount: -2, categoryId: '2', categorySource: 'notification' },
  { id: '32', timestamp: `${sevenDaysAgo}T14:15:00`, date: sevenDaysAgo, merchant: 'Bus Ticket', amount: -4, categoryId: '1', categorySource: 'notification' },
  { id: '33', timestamp: `${sevenDaysAgo}T10:45:00`, date: sevenDaysAgo, merchant: 'Grocery Store', amount: -18, categoryId: '4', categorySource: 'notification' },
  
  // Eight days ago (Green - Low spending day)
  { id: '34', timestamp: `${eightDaysAgo}T20:00:00`, date: eightDaysAgo, merchant: 'Snack Corner', amount: -5, categoryId: '2', categorySource: 'notification' },
  { id: '35', timestamp: `${eightDaysAgo}T16:30:00`, date: eightDaysAgo, merchant: 'Auto Rickshaw', amount: -8, categoryId: '1', categorySource: 'notification' },
  { id: '36', timestamp: `${eightDaysAgo}T11:20:00`, date: eightDaysAgo, merchant: 'Vegetable Market', amount: -12, categoryId: '4', categorySource: 'notification' },
  
  // Nine days ago (Green - Very low spending day)
  { id: '37', timestamp: `${nineDaysAgo}T18:45:00`, date: nineDaysAgo, merchant: 'Juice Shop', amount: -3, categoryId: '2', categorySource: 'notification' },
  { id: '38', timestamp: `${nineDaysAgo}T12:10:00`, date: nineDaysAgo, merchant: 'Metro Card', amount: -10, categoryId: '1', categorySource: 'notification' },
];

const initialState: AppState = {
  selectedDate: today,
  settings: {
  dailyLimit: 100,
    warningThreshold: 80,
    exceededThreshold: 100,
    notifyWarning: true,
    notifyExceeded: true,
  },
  categories: defaultCategories,
  transactions: seedTransactions,
  showOnboarding: false,
  showCategorization: { show: false },
};

export function useAppState() {
  const [state, setState] = useState<AppState>(initialState);

  const daySpend = useMemo(() => {
    return state.transactions
      .filter(t => t.date === state.selectedDate && t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  }, [state.transactions, state.selectedDate]);

  const remaining = useMemo(() => {
    return Math.max(0, state.settings.dailyLimit - daySpend);
  }, [daySpend, state.settings.dailyLimit]);

  const percentageSpent = useMemo(() => {
    return Math.round((daySpend / state.settings.dailyLimit) * 100);
  }, [daySpend, state.settings.dailyLimit]);

  const getStatusColor = (percentage: number) => {
    if (percentage <= 80) return 'success';
    if (percentage <= 100) return 'warning';
    return 'danger';
  };

  const getAssistantMessage = (percentage: number) => {
    if (percentage < 50) return "All good—steady flight today.";
    if (percentage < 70) return "Halfway there. Keep cruising.";
    if (percentage < 100) return "Close to your limit. Glide carefully.";
    return "Limit exceeded. Time to perch and pause.";
  };

  const updateState = (updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    setState(prev => ({
      ...prev,
      transactions: [newTransaction, ...prev.transactions],
    }));
    return newTransaction;
  };

  const updateTransaction = (id: string, updates: Partial<Transaction>) => {
    setState(prev => ({
      ...prev,
      transactions: prev.transactions.map(t => 
        t.id === id ? { ...t, ...updates } : t
      ),
    }));
  };

  const getSevenDayTrend = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const date = format(new Date(Date.now() - i * 86400000), 'yyyy-MM-dd');
      const spend = state.transactions
        .filter(t => t.date === date && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      const percentage = Math.round((spend / state.settings.dailyLimit) * 100);
      days.push(percentage);
    }
    return days;
  };

  const getTopCategory = () => {
    const dayTransactions = state.transactions.filter(
      t => t.date === state.selectedDate && t.amount < 0 && t.categoryId
    );
    
    const categorySpends = dayTransactions.reduce((acc, t) => {
      if (t.categoryId) {
        acc[t.categoryId] = (acc[t.categoryId] || 0) + Math.abs(t.amount);
      }
      return acc;
    }, {} as Record<string, number>);

    const topCategoryId = Object.keys(categorySpends).reduce((a, b) =>
      categorySpends[a] > categorySpends[b] ? a : b, ''
    );

    const category = state.categories.find(c => c.id === topCategoryId);
    return category ? { 
      category, 
      amount: categorySpends[topCategoryId] 
    } : null;
  };

  return {
    state,
    updateState,
    addTransaction,
    updateTransaction,
    daySpend,
    remaining,
    percentageSpent,
    getStatusColor,
    getAssistantMessage,
    getSevenDayTrend,
    getTopCategory,
  };
}