'use server';

import {
  getPersonalizedBudgetSuggestions,
  type PersonalizedBudgetSuggestionsInput,
  type PersonalizedBudgetSuggestionsOutput,
} from '@/ai/flows/personalized-budget-suggestions';

type ActionResult = {
  success: boolean;
  data?: PersonalizedBudgetSuggestionsOutput;
  error?: string;
};

export async function getAIAdvice(
  input: PersonalizedBudgetSuggestionsInput
): Promise<ActionResult> {
  try {
    const result = await getPersonalizedBudgetSuggestions(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI advice generation failed:', error);
    return {
      success: false,
      error: 'Failed to get personalized advice. Please try again later.',
    };
  }
}
