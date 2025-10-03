import { Suspense } from 'react';
import { LoginForm } from '@/components/login-form';
import { Loader2 } from 'lucide-react';

function LoginPageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageLoading />}>
      <LoginForm />
    </Suspense>
  );
}
