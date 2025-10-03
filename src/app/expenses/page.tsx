'use client';
import { useState, useEffect, useMemo } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { UserNav } from '@/components/user-nav';
import { DashboardHeader } from '@/components/dashboard/header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { ExpenseForm } from '@/app/expenses/expense-form';
import { ExpenseTable } from '@/app/expenses/expense-table';
import {
  useUser,
  useFirestore,
  useCollection,
  useMemoFirebase,
  deleteDocumentNonBlocking,
} from '@/firebase';
import { collection, doc, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Transaction, Category } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { AddExpenseForm } from '@/components/dashboard/add-expense-form';

export default function ExpensesPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Transaction | undefined>(
    undefined
  );
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);

  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const expensesQuery = useMemoFirebase(
    () => (user ? query(collection(firestore, 'users', user.uid, 'expenses'), orderBy('date', 'desc')) : null),
    [user, firestore]
  );
  const categoriesQuery = useMemoFirebase(
    () => (user ? collection(firestore, 'users', user.uid, 'categories') : null),
    [user, firestore]
  );

  const { data: expenses, isLoading: expensesLoading } =
    useCollection<Transaction>(expensesQuery);
  const { data: categories, isLoading: categoriesLoading } =
    useCollection<Category>(categoriesQuery);

  const processedExpenses = useMemo(() => {
    return expenses?.map(t => ({
      ...t,
      date: (t.date as unknown as Timestamp).toDate(),
    })) || [];
  }, [expenses]);

  const isLoading = isUserLoading || expensesLoading || categoriesLoading;

  const handleAddExpense = () => {
    setIsAddDialogOpen(true);
  };

  const handleEditExpense = (expense: Transaction) => {
    setSelectedExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleDeleteExpense = (expenseId: string) => {
    setExpenseToDelete(expenseId);
    setIsAlertOpen(true);
  };

  const confirmDelete = () => {
    if (!user || !expenseToDelete) return;
    const expenseDocRef = doc(firestore, 'users', user.uid, 'expenses', expenseToDelete);
    deleteDocumentNonBlocking(expenseDocRef);
    toast({
      title: 'Expense Deleted',
      description: 'Your expense has been successfully deleted.',
    });
    setIsAlertOpen(false);
    setExpenseToDelete(null);
  };

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <MainNav />
        </SidebarContent>
        <SidebarFooter>
          <UserNav />
        </SidebarFooter>
      </Sidebar>
      <div className="flex flex-col">
        <DashboardHeader categories={categories || []} />
        <main className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold md:text-2xl">Expenses</h1>
            <Button size="sm" onClick={handleAddExpense}>
              <PlusCircle className="mr-2 h-4 w-4" />
              <span>Add Expense</span>
            </Button>
          </div>
          <ExpenseTable
            expenses={processedExpenses}
            categories={categories || []}
            onEdit={handleEditExpense}
            onDelete={handleDeleteExpense}
          />
        </main>
      </div>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>
              Enter the details of your expense. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <AddExpenseForm categories={categories || []} setOpen={setIsAddDialogOpen} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Update the details of your expense.
            </DialogDescription>
          </DialogHeader>
          <ExpenseForm 
            expense={selectedExpense} 
            categories={categories || []} 
            setOpen={setIsEditDialogOpen} 
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              expense.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
