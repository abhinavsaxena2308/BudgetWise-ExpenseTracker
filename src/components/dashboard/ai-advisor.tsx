'use client';
import { useState, useTransition } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Sparkles } from 'lucide-react';
import type { Budget, Transaction } from '@/lib/types';
import { getAIAdvice } from '@/actions/ai-actions';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

type AIAdvisorProps = {
  budgets: Budget[];
  transactions: Transaction[];
};

type AISuggestion = {
  suggestions: { category: string; suggestion: string }[];
  overallAnalysis: string;
};

export function AiAdvisor({ budgets, transactions }: AIAdvisorProps) {
  const [isPending, startTransition] = useTransition();
  const [financialGoals, setFinancialGoals] = useState('');
  const [advice, setAdvice] = useState<AISuggestion | null>(null);
  const { toast } = useToast();

  const handleGetAdvice = () => {
    if (!financialGoals.trim()) {
      toast({
        title: 'Financial Goals Required',
        description: 'Please tell us your financial goals to get advice.',
        variant: 'destructive',
      });
      return;
    }

    startTransition(async () => {
      const spendingData = budgets.map((budget) => {
        const spent = transactions
          .filter((t) => t.categoryId === budget.categoryId)
          .reduce((sum, t) => sum + t.amount, 0);
        return {
          category:
            transactions.find((t) => t.categoryId === budget.categoryId)
              ?.description || 'Unknown',
          amount: spent,
          budget: budget.amount,
        };
      });

      const result = await getAIAdvice({ spendingData, financialGoals });
      if (result.success) {
        setAdvice(result.data as AISuggestion);
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <span>AI Personal Advisor</span>
        </CardTitle>
        <CardDescription>
          Get AI-powered suggestions to reach your financial goals faster.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="e.g., Save for a down payment, pay off debt, build an emergency fund..."
          value={financialGoals}
          onChange={(e) => setFinancialGoals(e.target.value)}
          disabled={isPending}
        />
        {advice && (
          <div className="space-y-4 rounded-lg border bg-secondary/30 p-4">
            <h4 className="font-semibold">Overall Analysis</h4>
            <p className="text-sm text-muted-foreground">
              {advice.overallAnalysis}
            </p>
            <Accordion type="single" collapsible className="w-full">
              {advice.suggestions.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>{item.category}</AccordionTrigger>
                  <AccordionContent>{item.suggestion}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleGetAdvice} disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : (
            <Sparkles className="mr-2 h-4 w-4" />
          )}
          <span>{isPending ? 'Analyzing...' : 'Get Advice'}</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
