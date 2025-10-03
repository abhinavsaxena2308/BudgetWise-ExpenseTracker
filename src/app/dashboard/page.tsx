'use client';
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
import { Overview } from '@/components/dashboard/overview';
import { SpendingChart } from '@/components/dashboard/spending-chart';
import { CategoryChart } from '@/components/dashboard/category-chart';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { BudgetStatus } from '@/components/dashboard/budget-status';
import { AiAdvisor } from '@/components/dashboard/ai-advisor';
import { useUser, useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Loader2 } from 'lucide-react';
import { collection, query, orderBy, Timestamp } from 'firebase/firestore';
import type { Transaction, Budget, Category } from '@/lib/types';
import { CategorySeeder } from '@/components/dashboard/category-seeder';

export default function DashboardPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/login');
    }
  }, [isUserLoading, user, router]);

  const transactionsQuery = useMemoFirebase(() => 
    user ? query(collection(firestore, 'users', user.uid, 'expenses'), orderBy('date', 'desc')) : null,
    [user, firestore]
  );
  const budgetsQuery = useMemoFirebase(() =>
    user ? collection(firestore, 'users', user.uid, 'budgets') : null,
    [user, firestore]
  );
  const categoriesQuery = useMemoFirebase(() => 
    user ? collection(firestore, 'users', user.uid, 'categories') : null, 
    [user, firestore]
  );

  const { data: transactions, isLoading: transactionsLoading } = useCollection<Transaction>(transactionsQuery);
  const { data: budgets, isLoading: budgetsLoading } = useCollection<Budget>(budgetsQuery);
  const { data: categories, isLoading: categoriesLoading } = useCollection<Category>(categoriesQuery);

  // Convert Firestore Timestamps to JS Date objects
  const processedTransactions = useMemo(() => {
    return transactions?.map(t => ({
      ...t,
      date: (t.date as unknown as Timestamp).toDate(),
    })) || [];
  }, [transactions]);


  const getSpendingData = (trans: Transaction[]) => {
    if (!trans) return [];
    const data: { date: string; spending: number | null }[] = [];
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const now = new Date();

    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(now.getFullYear(), now.getMonth(), day);
        const dailySpending = trans
            .filter(t => t.date.getDate() === day && t.date.getMonth() === now.getMonth() && t.date.getFullYear() === now.getFullYear())
            .reduce((sum, t) => sum + t.amount, 0);
        
        if (date > now) break;

        data.push({
            date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
            spending: dailySpending > 0 ? dailySpending : null,
        });
    }
    return data;
  };

  const getCategorySpending = (trans: Transaction[], cats: Category[]) => {
      if (!trans || !cats) return [];
      const categorySpending = cats.map(category => {
          const total = trans
              .filter(t => t.categoryId === category.id)
              .reduce((sum, t) => sum + t.amount, 0);
          return {
              name: category.name,
              value: total,
              fill: category.color,
          };
      }).filter(c => c.value > 0);
      return categorySpending;
  }

  const spendingData = getSpendingData(processedTransactions);
  const categorySpending = getCategorySpending(processedTransactions, categories || []);


  const isLoading = isUserLoading || transactionsLoading || budgetsLoading || categoriesLoading;

  if (isLoading || !user) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <CategorySeeder categories={categories || []} />
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
          <Overview
            transactions={processedTransactions || []}
            budgets={budgets || []}
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
            <SpendingChart
              className="lg:col-span-4"
              data={spendingData}
            />
            <CategoryChart
              className="lg:col-span-3"
              data={categorySpending}
              categories={categories || []}
            />
          </div>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
            <RecentTransactions
              className="lg:col-span-4"
              transactions={processedTransactions || []}
              categories={categories || []}
            />
            <div className="lg:col-span-3 flex flex-col gap-4">
              <BudgetStatus
                budgets={budgets || []}
                transactions={processedTransactions || []}
                categories={categories || []}
              />
              <AiAdvisor
                budgets={budgets || []}
                transactions={processedTransactions || []}
                categories={categories || []}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
