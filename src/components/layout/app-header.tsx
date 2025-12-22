'use client';

import { usePathname } from 'next/navigation';
import { PlusCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';

import ExpenseDialog from '@/components/expenses/expense-dialog';

export default function AppHeader() {
  const pathname = usePathname();
  const pageTitle = pathname.split('/').pop()?.replace('-', ' ') || 'Dashboard';
  
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold capitalize">{pageTitle}</h1>
       </div>
      <div className="ml-auto flex items-center gap-2">
        <ExpenseDialog>
            <Button size="sm" className="h-8 gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                    Add Expense
                </span>
            </Button>
        </ExpenseDialog>
      </div>
    </header>
  );
}