import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/lib/types';
import { getCategories } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type RecentTransactionsProps = {
  className?: string;
  transactions: Transaction[];
};

export function RecentTransactions({
  className,
  transactions,
}: RecentTransactionsProps) {
  const categories = getCategories();
  const categoryMap = new Map(categories.map((cat) => [cat.id, cat]));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const sortedTransactions = [...transactions].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  ).slice(0, 5);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>
          A list of your 5 most recent transactions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTransactions.map((transaction) => {
              const category = categoryMap.get(transaction.categoryId);
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    {category && (
                       <Badge
                        variant="outline"
                        className="border-primary/50 text-primary"
                      >
                        {category.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{format(transaction.date, 'MMM d')}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
