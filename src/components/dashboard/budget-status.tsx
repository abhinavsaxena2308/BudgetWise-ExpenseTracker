import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Budget, Transaction, Category } from '@/lib/types';
import { cn } from '@/lib/utils';

type BudgetStatusProps = {
  budgets: Budget[];
  transactions: Transaction[];
  categories: Category[];
};

export function BudgetStatus({ budgets, transactions, categories }: BudgetStatusProps) {
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  const budgetData = budgets.map((budget) => {
    const category = categoryMap.get(budget.categoryId);
    const spent = transactions
      .filter((t) => t.categoryId === budget.categoryId)
      .reduce((sum, t) => sum + t.amount, 0);
    const progress = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return {
      ...budget,
      categoryName: category?.name || 'Unknown',
      spent,
      progress: Math.min(progress, 100), // Cap at 100%
      isOver: progress > 100,
    };
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Status</CardTitle>
        <CardDescription>Your spending progress for each category.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {budgetData.length > 0 ? (
          budgetData.map((budget) => (
            <div key={budget.id}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium">{budget.categoryName}</span>
                <span
                  className={cn(
                    'text-muted-foreground',
                    budget.isOver && 'font-bold text-destructive'
                  )}
                >
                  {formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}
                </span>
              </div>
              <Progress value={budget.progress} className={cn(budget.isOver && '[&>div]:bg-destructive')} />
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No budgets set yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
