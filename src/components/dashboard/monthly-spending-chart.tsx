'use client';

import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/components/context/app-provider';
import { format, eachDayOfInterval, startOfMonth, endOfMonth, isThisMonth } from 'date-fns';

export default function MonthlySpendingChart() {
  const { expenses } = useApp();

  const today = new Date();
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const data = daysInMonth.map(day => {
    const dailyTotal = expenses
      .filter(expense => isThisMonth(expense.date) && format(expense.date, 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd'))
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    return {
      name: format(day, 'd'),
      total: dailyTotal,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>This Month's Spending</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              stroke="hsl(var(--foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `₹${value}`}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))' }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="total" 
              stroke="hsl(var(--accent))" 
              strokeWidth={2}
              dot={{ r: 4, fill: 'hsl(var(--accent))' }}
              activeDot={{ r: 8, fill: 'hsl(var(--accent))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
