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
import type { Transaction, Category } from '@/lib/types';
import { format } from 'date-fns';
import { Badge } from '../../components/ui/badge';

type ExpenseTableProps = {
  expenses: Transaction[];
  categories: Category[];
  onEdit: (expense: Transaction) => void;
  onDelete: (expenseId: string) => void;
};

export function ExpenseTable({
  expenses,
  categories,
  onEdit,
  onDelete,
}: ExpenseTableProps) {
  const categoryMap = new Map(categories.map((c) => [c.id, c]));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length > 0 ? (
            expenses.map((expense) => {
              const category = categoryMap.get(expense.categoryId);
              return (
              <TableRow key={expense.id}>
                <TableCell className="font-medium">{expense.description}</TableCell>
                 <TableCell>
                      {category && (
                         <Badge
                          variant="outline"
                          style={{
                            color: category.color,
                            borderColor: category.color,
                          }}
                        >
                          {category.name}
                        </Badge>
                      )}
                    </TableCell>
                <TableCell>{format(expense.date, 'PPP')}</TableCell>
                <TableCell>{formatCurrency(expense.amount)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(expense)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Expense</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(expense.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete Expense</span>
                  </Button>
                </TableCell>
              </TableRow>
            )})
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-muted-foreground"
              >
                No expenses found. Add one to get started!
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
