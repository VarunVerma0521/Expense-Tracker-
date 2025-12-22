'use client';

import { useState } from 'react';
import { useApp } from '@/components/context/app-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Trash, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const { monthlyBudget, setMonthlyBudget, categories, addCategory, deleteCategory, alertSettings, setAlertSettings } = useApp();
  const [budget, setBudget] = useState(monthlyBudget);
  const [newCategory, setNewCategory] = useState('');
  const { toast } = useToast();

  const handleSaveBudget = () => {
    setMonthlyBudget(budget);
    toast({
      title: 'Settings Saved',
      description: 'Your monthly budget has been updated.',
    });
  };
  
  const handleAddCategory = () => {
    if (newCategory.trim() === '') {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Category name cannot be empty.',
        });
        return;
    }
    if (categories.find(c => c.toLowerCase() === newCategory.toLowerCase())) {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Category already exists.',
        });
        return;
    }
    addCategory(newCategory);
    setNewCategory('');
    toast({
      title: 'Category Added',
      description: `"${newCategory}" has been added.`,
    });
  };

  const handleDeleteCategory = (categoryToDelete: string) => {
    if (categoryToDelete === 'Other') {
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'The "Other" category cannot be deleted.',
        });
        return;
    }
    deleteCategory(categoryToDelete);
    toast({
      title: 'Category Deleted',
      description: `"${categoryToDelete}" has been removed.`,
    });
  };

  const handleAlertsToggle = (checked: boolean) => {
    setAlertSettings({ ...alertSettings, budgetThreshold: checked });
    toast({
        title: 'Settings Saved',
        description: `Budget alerts have been ${checked ? 'enabled' : 'disabled'}.`,
    });
  };

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Monthly Budget</CardTitle>
          <CardDescription>
            Set your total spending limit for each month.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2">
            <Label htmlFor="monthly-budget">Budget</Label>
            <Input
              id="monthly-budget"
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full sm:w-1/2"
            />
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button onClick={handleSaveBudget}>Save Budget</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Categories</CardTitle>
          <CardDescription>
            Add or remove spending categories.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="New category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              onKeyUp={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button onClick={handleAddCategory}>Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="flex items-center gap-1.5 pl-3 pr-1.5 py-1 text-sm">
                {category}
                {category !== 'Other' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <button className="rounded-full hover:bg-muted-foreground/20 p-0.5">
                            <X className="h-3 w-3" />
                        </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will delete the "{category}" category. All expenses under this category will be moved to "Other". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteCategory(category)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Alert Settings</CardTitle>
          <CardDescription>
            Configure when you receive notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="budget-alert" className="flex flex-col gap-1">
                <span>Budget Threshold Alerts</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Receive a warning when you approach your budget limit.
                </span>
            </Label>
            <Switch
              id="budget-alert"
              checked={alertSettings.budgetThreshold}
              onCheckedChange={handleAlertsToggle}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
