'use client';

import { useState } from 'react';
import { Lightbulb, LoaderCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useApp } from '@/components/context/app-provider';
import { ai } from '@/lib/genkit-client';
import { analyzeSpending } from '@/ai/flows/intelligent-spend-analyzer';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export default function SpendAnalyzer() {
  const { expenses, monthlyBudget } = useApp();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [advice, setAdvice] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAdvice(null);
    try {
      const expensesForAI = expenses.map(e => ({
        ...e,
        date: format(e.date, 'yyyy-MM-dd')
      }));

      const result = await analyzeSpending({ expenses: expensesForAI, monthlyBudget });
      setAdvice(result.advice);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Failed to analyze spending:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not get AI-powered advice. Please try again later.',
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-400" />
            <span>Intelligent Spend Analyzer</span>
          </CardTitle>
          <CardDescription>
            Get AI-powered advice on your spending habits.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
            {isAnalyzing ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              'Get AI Advice'
            )}
          </Button>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Your Financial Advice
            </DialogTitle>
            <DialogDescription>
              Here are some personalized tips based on your spending.
            </DialogDescription>
          </DialogHeader>
          <div className="prose prose-sm max-h-[60vh] overflow-y-auto rounded-md border p-4">
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{advice}</p>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
