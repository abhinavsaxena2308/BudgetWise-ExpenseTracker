'use client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import type { Budget, Category } from '@/lib/types';
import { format } from 'date-fns';

type BudgetTableProps = {
  budgets: Budget[];
  categories: Category[];
  onEdit: (budget: Budget) => void;
  onDelete: (budgetId: string) => void;
};

export function BudgetTable({
  budgets,
  categories,
  onEdit,
  onDelete,
}: BudgetTableProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatMonth = (month: string) => {
    if (!month) return ''; // Add a guard for undefined month
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return format(date, 'MMMM yyyy');
  };

  const budgetsWithCategoryNames = budgets.map(budget => ({
    ...budget,
    categoryName: categoryMap.get(budget.categoryId) || 'Unknown',
  }));

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Month</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgetsWithCategoryNames.length > 0 ? (
            budgetsWithCategoryNames.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">{budget.categoryName}</TableCell>
                <TableCell>{formatMonth(budget.month)}</TableCell>
                <TableCell>{formatCurrency(budget.amount)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(budget)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Budget</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(budget.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Budget</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                className="text-center text-muted-foreground"
              >
                No budgets set yet. Add one to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
