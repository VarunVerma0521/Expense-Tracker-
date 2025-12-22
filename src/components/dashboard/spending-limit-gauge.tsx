'use client';

import { useApp } from '@/components/context/app-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { isThisMonth } from 'date-fns';

export default function SpendingLimitGauge() {
  const { expenses, monthlyBudget } = useApp();

  const totalSpentThisMonth = expenses
    .filter(expense => isThisMonth(expense.date))
    .reduce((sum, expense) => sum + expense.amount, 0);
  
  const percentageSpent = monthlyBudget > 0 ? (totalSpentThisMonth / monthlyBudget) * 100 : 0;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };
  
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Monthly Budget Progress</CardTitle>
        <CardDescription>
          You have spent {formatCurrency(totalSpentThisMonth)} of {formatCurrency(monthlyBudget)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Progress value={percentageSpent} aria-label={`${percentageSpent.toFixed(0)}% of budget spent`} />
        <div className="mt-2 flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>{percentageSpent.toFixed(0)}%</span>
          <span>100%</span>
        </div>
      </CardContent>
    </Card>
  );
}
