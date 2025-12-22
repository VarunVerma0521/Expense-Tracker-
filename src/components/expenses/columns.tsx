'use client';

import type { ColumnDef } from '@tanstack/react-table';
import type { Expense } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import ExpenseDialog from './expense-dialog';
import { useApp } from '@/components/context/app-provider';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import React from 'react';


// This map can be removed if you prefer default badge styling for all categories.
const categoryVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
    'Food': 'default',
    'Transport': 'secondary',
    'Shopping': 'outline',
    'Entertainment': 'default',
    'Bills': 'destructive',
    'Other': 'secondary'
}

const DeleteExpenseDialog: React.FC<{ onConfirm: () => void }> = ({ onConfirm }) => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
          <DropdownMenuItem
              className="text-red-600"
              onSelect={(e) => e.preventDefault()} // Prevent dropdown from closing
          >
              <Trash className="mr-2 h-4 w-4" />
              Delete
          </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this expense record.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const ExpenseActions: React.FC<{ expense: Expense }> = ({ expense }) => {
    const { deleteExpense } = useApp();
    const { toast } = useToast();
    const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false);
  
    const handleDelete = () => {
      deleteExpense(expense.id);
      toast({ title: "Success", description: "Expense deleted successfully." });
    };
  
    return (
      <>
        <ExpenseDialog expenseToEdit={expense} open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} />

        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DeleteExpenseDialog onConfirm={handleDelete} />
            </DropdownMenuContent>
        </DropdownMenu>
      </>
    );
  };


export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = row.getValue('date') as Date;
      return <span>{date.toLocaleDateString()}</span>;
    },
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
        const category = row.getValue('category') as string;
        // The explicit variant mapping can be kept or removed for uniform styling
        return <Badge variant={categoryVariantMap[category] || 'secondary'}>{category}</Badge>
    }
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'note',
    header: 'Note',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const expense = row.original;
      return <ExpenseActions expense={expense} />;
    },
  },
];
