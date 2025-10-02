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
import { UserNav } from '../user-nav';
import { Category } from '@/lib/types';
import { useState } from 'react';

type DashboardHeaderProps = {
  categories?: Category[];
};

export function DashboardHeader({ categories = [] }: DashboardHeaderProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-6">
      <SidebarTrigger className="lg:hidden" />
      <div className="w-full flex-1">
        {/* You can add a search bar here if needed */}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
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
          <AddExpenseForm categories={categories} setOpen={setOpen} />
        </DialogContent>
      </Dialog>
      <UserNav />
    </header>
  );
}
