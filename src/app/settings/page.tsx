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

export default function SettingsPage() {
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
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p>Manage your account settings here.</p>
        </main>
      </SidebarInset>
    </div>
  );
}
