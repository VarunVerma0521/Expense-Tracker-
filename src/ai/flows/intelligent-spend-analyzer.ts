'use server';

/**
 * @fileOverview A flow that analyzes user spending habits and provides personalized advice using generative AI.
 *
 * - analyzeSpending - Analyzes spending habits and provides advice.
 * - AnalyzeSpendingInput - The input type for the analyzeSpending function.
 * - AnalyzeSpendingOutput - The return type for the analyzeSpending function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSpendingInputSchema = z.object({
  expenses: z.array(
    z.object({
      date: z.string(),
      amount: z.number(),
      category: z.string(),
      note: z.string().optional(),
    })
  ).describe('An array of expense objects, each containing date, amount, category, and an optional note.'),
  monthlyBudget: z.number().describe('The user\'s monthly budget.'),
});
export type AnalyzeSpendingInput = z.infer<typeof AnalyzeSpendingInputSchema>;

const AnalyzeSpendingOutputSchema = z.object({
  advice: z.string().describe('Personalized advice on how to reduce expenses and stay within budget.'),
});
export type AnalyzeSpendingOutput = z.infer<typeof AnalyzeSpendingOutputSchema>;

export async function analyzeSpending(input: AnalyzeSpendingInput): Promise<AnalyzeSpendingOutput> {
  return analyzeSpendingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSpendingPrompt',
  input: {schema: AnalyzeSpendingInputSchema},
  output: {schema: AnalyzeSpendingOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending habits based on their expenses and monthly budget. Provide personalized advice on how to reduce expenses and stay within budget.

Monthly Budget: {{{monthlyBudget}}}

Expenses:
{{#each expenses}}
- Date: {{date}}, Amount: {{amount}}, Category: {{category}}, Note: {{note}}
{{/each}}
`,
});

const analyzeSpendingFlow = ai.defineFlow(
  {
    name: 'analyzeSpendingFlow',
    inputSchema: AnalyzeSpendingInputSchema,
    outputSchema: AnalyzeSpendingOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
