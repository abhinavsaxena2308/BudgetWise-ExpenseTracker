'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogFooter } from '../ui/dialog';
import type { Budget, Category } from '@/lib/types';
import { useState, useEffect } from 'react';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
} from '@/firebase';
import {
  addDocumentNonBlocking,
  setDocumentNonBlocking,
} from '@/firebase/non-blocking-updates';
import { collection, doc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';

const formSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category.'),
  amount: z.coerce.number().positive('Amount must be a positive number.'),
  month: z
    .string()
    .regex(
      /^\d{4}-\d{2}$/,
      'Month must be in YYYY-MM format.'
    ),
});

type BudgetFormProps = {
  budget?: Budget;
  setOpen: (open: boolean) => void;
};

export function BudgetForm({ budget, setOpen }: BudgetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const isEditMode = !!budget;

  const categoriesQuery = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'categories') : null),
    [user, firestore]
  );
  const { data: categories, isLoading: categoriesLoading } =
    useCollection<Category>(categoriesQuery);

  const defaultMonth = format(new Date(), 'yyyy-MM');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: budget?.categoryId || '',
      amount: budget?.amount || 0,
      month: budget?.month || defaultMonth,
    },
  });

  useEffect(() => {
    form.reset({
      categoryId: budget?.categoryId || '',
      amount: budget?.amount || 0,
      month: budget?.month || defaultMonth,
    });
  }, [budget, form, defaultMonth]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      toast({
        title: 'Error',
        description: 'You must be logged in to manage budgets.',
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);

    const budgetData = {
      ...values,
      userId: user.uid,
    };

    if (isEditMode && budget?.id) {
      const budgetDocRef = doc(
        firestore,
        'users',
        user.uid,
        'budgets',
        budget.id
      );
      setDocumentNonBlocking(budgetDocRef, budgetData, { merge: true });
      toast({
        title: 'Budget Updated',
        description: 'Your budget has been successfully updated.',
      });
    } else {
      const budgetsColRef = collection(firestore, 'users', user.uid, 'budgets');
      addDocumentNonBlocking(budgetsColRef, budgetData);
      toast({
        title: 'Budget Added',
        description: 'Your new budget has been successfully added.',
      });
    }

    setIsLoading(false);
    setOpen(false);
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isEditMode}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categoriesLoading ? (
                    <SelectItem value="loading" disabled>
                      Loading...
                    </SelectItem>
                  ) : (
                    categories?.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="month"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Month</FormLabel>
              <FormControl>
                <Input
                  type="month"
                  {...field}
                  disabled={isEditMode}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (₹)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="50000.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditMode ? 'Save Changes' : 'Add Budget'}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
