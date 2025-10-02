import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
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
import {
  getBudgets,
  getCategories,
  getTransactions,
  getSpendingData,
  getCategorySpending,
} from '@/lib/data';

export default function DashboardPage() {
  // Fetch mock data
  const transactions = getTransactions();
  const budgets = getBudgets();
  const categories = getCategories();
  const spendingData = getSpendingData();
  const categorySpending = getCategorySpending();

  return (
    <div className="relative min-h-screen">
      <Sidebar>
        <div className="flex h-full flex-col">
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
          <SidebarFooter>
            <UserNav />
          </SidebarFooter>
        </div>
      </Sidebar>
      <SidebarInset>
        <DashboardHeader />
        <main className="space-y-6 p-4 sm:p-6 lg:p-8">
          <Overview
            transactions={transactions}
            budgets={budgets}
          />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <SpendingChart
              className="lg:col-span-3"
              data={spendingData}
            />
            <CategoryChart
              className="lg:col-span-2"
              data={categorySpending}
              categories={categories}
            />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <RecentTransactions
              className="lg:col-span-3"
              transactions={transactions}
            />
            <div className="lg:col-span-2 space-y-6">
              <BudgetStatus
                budgets={budgets}
                transactions={transactions}
              />
              <AiAdvisor
                budgets={budgets}
                transactions={transactions}
              />
            </div>
          </div>
        </main>
      </SidebarInset>
    </div>
  );
}
