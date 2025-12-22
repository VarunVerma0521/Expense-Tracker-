import type { Expense, Alert } from './types';
import { subDays, subMonths } from 'date-fns';

const today = new Date();

export const MOCK_EXPENSES: Expense[] = [
  { id: '1', userId: 'user1', date: subDays(today, 1), amount: 12.50, category: 'Food', note: 'Lunch with colleagues' },
  { id: '2', userId: 'user1', date: subDays(today, 2), amount: 45.00, category: 'Shopping', note: 'New shoes' },
  { id: '3', userId: 'user1', date: subDays(today, 3), amount: 5.25, category: 'Transport', note: 'Bus fare' },
  { id: '4', userId: 'user1', date: subDays(today, 5), amount: 75.00, category: 'Bills', note: 'Internet bill' },
  { id: '5', userId: 'user1', date: subDays(today, 6), amount: 30.00, category: 'Entertainment', note: 'Movie tickets' },
  { id: '6', userId: 'user1', date: subDays(today, 8), amount: 8.99, category: 'Food', note: 'Coffee' },
  { id: '7', userId: 'user1', date: subDays(today, 10), amount: 150.00, category: 'Other', note: 'Gift for a friend' },
  { id: '8', userId: 'user1', date: subDays(today, 12), amount: 22.00, category: 'Transport', note: 'Gas' },
  { id: '9', userId: 'user1', date: subDays(today, 15), amount: 60.00, category: 'Shopping', note: 'Groceries' },
  { id: '10', userId: 'user1', date: subDays(today, 20), amount: 120.00, category: 'Bills', note: 'Electricity bill' },
  { id: '11', userId: 'user1', date: subMonths(today, 1), amount: 15.00, category: 'Food', note: 'Dinner' },
  { id: '12', userId: 'user1', date: subMonths(today, 1), amount: 20.00, category: 'Entertainment', note: 'Concert' },
];

export const MOCK_ALERTS: Alert[] = [
  { id: '1', message: "You've reached 85% of your monthly budget for Shopping.", type: 'warning', date: subDays(today, 2) },
  { id: '2', message: 'A large transaction of $150.00 was recorded.', type: 'info', date: subDays(today, 10) },
];

export const MOCK_MONTHLY_BUDGET = 1000;
