import type { LucideIcon } from "lucide-react";

export type Category = string;

export const DEFAULT_CATEGORIES: Category[] = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other'];

export type Expense = {
  id: string;
  date: Date;
  amount: number;
  category: Category;
  note: string;
};

export type Alert = {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error';
  date: Date;
};

export type Page = {
  path: string;
  title: string;
  icon: LucideIcon;
};
