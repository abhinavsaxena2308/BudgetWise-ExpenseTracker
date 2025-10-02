'use client';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { PlusCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { AddExpenseForm } from './add-expense-form';

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <SidebarTrigger className="md:hidden" />
      <h1 className="text-xl font-semibold font-headline">Dashboard</h1>
      <div className="ml-auto flex items-center gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle />
              <span>Add Expense</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
              <DialogDescription>
                Enter the details of your expense. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <AddExpenseForm />
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
