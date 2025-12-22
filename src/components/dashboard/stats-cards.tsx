'use client';

import { useApp } from '@/components/context/app-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Scale, Banknote } from 'lucide-react';
import { isThisMonth } from 'date-fns';

export default function StatsCards() {
  const { expenses, monthlyBudget } = useApp();

  const totalSpentThisMonth = expenses
    .filter(expense => isThisMonth(expense.date))
    .reduce((sum, expense) => sum + expense.amount, 0);

  const remainingBudget = monthlyBudget - totalSpentThisMonth;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const stats = [
    {
      title: 'Spent (This Month)',
      value: formatCurrency(totalSpentThisMonth),
      icon: DollarSign,
      color: 'text-red-500',
    },
    {
      title: 'Monthly Budget',
      value: formatCurrency(monthlyBudget),
      icon: Scale,
      color: 'text-blue-500',
    },
    {
      title: 'Remaining',
      value: formatCurrency(remainingBudget),
      icon: Banknote,
      color: remainingBudget >= 0 ? 'text-green-500' : 'text-red-500',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 text-muted-foreground ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color}`}>
              {stat.value}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
