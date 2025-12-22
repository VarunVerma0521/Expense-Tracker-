'use client';

import { useApp } from '@/components/context/app-provider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ExpensesDataTable } from '@/components/expenses/data-table';
import { columns } from '@/components/expenses/columns';

export default function ExpensesPage() {
  const { expenses } = useApp();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Expenses</CardTitle>
        <CardDescription>
          A detailed list of all your recorded expenses.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ExpensesDataTable columns={columns} data={expenses} />
      </CardContent>
    </Card>
  );
}
