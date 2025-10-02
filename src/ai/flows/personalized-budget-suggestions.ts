'use server';

/**
 * @fileOverview A flow for providing personalized budget suggestions based on spending patterns.
 *
 * - getPersonalizedBudgetSuggestions - A function that generates personalized budget suggestions.
 * - PersonalizedBudgetSuggestionsInput - The input type for the getPersonalizedBudgetSuggestions function.
 * - PersonalizedBudgetSuggestionsOutput - The return type for the getPersonalizedBudgetSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizedBudgetSuggestionsInputSchema = z.object({
  spendingData: z.array(
    z.object({
      category: z.string().describe('The spending category (e.g., Food, Travel, Entertainment).'),
      amount: z.number().describe('The amount spent in the category.'),
      budget: z.number().describe('The current budget for the category.'),
    })
  ).describe('An array of spending data objects, each containing the category, amount spent, and current budget.'),
  financialGoals: z.string().describe('The user specified financial goals.'),
});

export type PersonalizedBudgetSuggestionsInput = z.infer<typeof PersonalizedBudgetSuggestionsInputSchema>;

const PersonalizedBudgetSuggestionsOutputSchema = z.object({
  suggestions: z.array(
    z.object({
      category: z.string().describe('The spending category.'),
      suggestion: z.string().describe('The suggested budget adjustment and explanation.'),
    })
  ).describe('An array of budget suggestions for each category.'),
  overallAnalysis: z.string().describe('An overall analysis of the user spending habits and how well they align with their financial goals.'),
});

export type PersonalizedBudgetSuggestionsOutput = z.infer<typeof PersonalizedBudgetSuggestionsOutputSchema>;

export async function getPersonalizedBudgetSuggestions(input: PersonalizedBudgetSuggestionsInput): Promise<PersonalizedBudgetSuggestionsOutput> {
  return personalizedBudgetSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizedBudgetSuggestionsPrompt',
  input: {schema: PersonalizedBudgetSuggestionsInputSchema},
  output: {schema: PersonalizedBudgetSuggestionsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user's spending data and provide personalized budget suggestions to help them achieve their financial goals.

Financial Goals: {{{financialGoals}}}

Spending Data:
{{#each spendingData}}
Category: {{{category}}}
Amount Spent: {{{amount}}}
Current Budget: {{{budget}}}
{{/each}}

Provide specific suggestions for each category, explaining why the adjustment is recommended.  Also, provide an overall analysis of the user's spending habits.

Format your response as a JSON object that matches the following schema:
${JSON.stringify(PersonalizedBudgetSuggestionsOutputSchema.shape, null, 2)}`,
});

const personalizedBudgetSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizedBudgetSuggestionsFlow',
    inputSchema: PersonalizedBudgetSuggestionsInputSchema,
    outputSchema: PersonalizedBudgetSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
