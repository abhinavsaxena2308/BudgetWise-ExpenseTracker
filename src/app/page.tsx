
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Landmark, MoveRight } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center">
        <Logo />
        <nav className="ml-auto flex gap-4 sm:gap-6">
          
          <Button asChild>
            <Link href="/login">
              Login <MoveRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link href="/login?signup=true">
              Sign Up <MoveRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Take Control of Your Finances
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  BudgetWise is the simple, smart, and secure way to manage
                  your personal budget, track expenses, and achieve your
                  financial goals.
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild size="lg">
                  <Link href="/login?signup=true">Get Started for Free</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} BudgetWise. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
