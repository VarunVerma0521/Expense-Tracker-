'use client';

import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import type { Expense, Alert, Category } from '@/lib/types';
import { MOCK_ALERTS, MOCK_MONTHLY_BUDGET } from '@/lib/mock-data';
import { DEFAULT_CATEGORIES } from '@/lib/types';
import { useAuthenticator } from '@aws-amplify/ui-react';

interface AppContextType {
  expenses: Expense[];
  alerts: Alert[];
  monthlyBudget: number;
  categories: Category[];
  alertSettings: { budgetThreshold: boolean };
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Omit<Expense, 'id'>) => void;
  deleteExpense: (id: string) => void;
  setMonthlyBudget: (budget: number) => void;
  addCategory: (category: Category) => void;
  deleteCategory: (category: Category) => void;
  setAlertSettings: (settings: { budgetThreshold: boolean }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuthenticator();
  const userId = user?.username || 'guest';
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
  const [monthlyBudget, setMonthlyBudget] = useState<number>(MOCK_MONTHLY_BUDGET);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);
  const [alertSettings, setAlertSettings] = useState({ budgetThreshold: true });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await fetch(`/api/expenses?userId=${userId}`);
        if (response.ok) {
          const data = await response.json();
          setExpenses(data);
        }
      } catch (error) {
        console.error('Failed to fetch expenses:', error);
      }
    };
    if (userId) fetchExpenses();
  }, [userId]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: (Math.random() * 100000).toString(),
      userId,
      date: new Date(),
    };
    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newExpense),
      });
      if (response.ok) {
        setExpenses(prev => [newExpense, ...prev].sort((a, b) => b.date.getTime() - a.date.getTime()));
      }
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  const updateExpense = async (id: string, updatedExpense: Omit<Expense, 'id'>) => {
    try {
      const response = await fetch('/api/expenses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, userId, ...updatedExpense }),
      });
      if (response.ok) {
        setExpenses(prev =>
          prev.map(exp => (exp.id === id ? { id, userId, ...updatedExpense } : exp))
            .sort((a, b) => b.date.getTime() - a.date.getTime())
        );
      }
    } catch (error) {
      console.error('Failed to update expense:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses?id=${id}&userId=${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setExpenses(prev => prev.filter(exp => exp.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete expense:', error);
    }
  };

  const addCategory = (category: string) => {
    if (category && !categories.includes(category)) {
      setCategories(prev => [...prev, category]);
    }
  };

  const deleteCategory = (categoryToDelete: string) => {
    setCategories(prev => prev.filter(cat => cat !== categoryToDelete));
    // Also update expenses that used this category to 'Other'
    setExpenses(prev => prev.map(exp => exp.category === categoryToDelete ? { ...exp, category: 'Other' } : exp));
  };

  const value = useMemo(() => ({
    expenses,
    alerts,
    monthlyBudget,
    categories,
    alertSettings,
    addExpense,
    updateExpense,
    deleteExpense,
    setMonthlyBudget,
    addCategory,
    deleteCategory,
    setAlertSettings,
  }), [expenses, alerts, monthlyBudget, categories, alertSettings]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
