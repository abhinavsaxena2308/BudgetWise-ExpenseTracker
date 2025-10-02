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
import { Edit } from 'lucide-react';
import type { Budget } from '@/lib/types';
import { format } from 'date-fns';
import { Timestamp } from 'firebase/firestore';

type BudgetTableProps = {
  budgets: Budget[];
  onEdit: (budget: Budget) => void;
};

export function BudgetTable({ budgets, onEdit }: BudgetTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (date: any) => {
    if (date instanceof Timestamp) {
      return format(date.toDate(), 'PPP');
    }
    if (date instanceof Date) {
      return format(date, 'PPP');
    }
    return 'N/A';
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {budgets.length > 0 ? (
            budgets.map((budget) => (
              <TableRow key={budget.id}>
                <TableCell className="font-medium">{budget.name}</TableCell>
                <TableCell>{formatCurrency(budget.amount)}</TableCell>
                <TableCell>{formatDate(budget.startDate)}</TableCell>
                <TableCell>{formatDate(budget.endDate)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(budget)}
                  >
                    <Edit className="h-4 w-4" />
                    <span className="sr-only">Edit Budget</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={5}
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
