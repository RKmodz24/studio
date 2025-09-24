"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '@/app/components/auth-form';
import { useUser } from '@/firebase';
import { Gem } from 'lucide-react';

export default function LoginPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/');
    }
  }, [user, isUserLoading, router]);

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // Only render the login form if the user is not logged in
  return !user ? (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 dark:bg-gray-900">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
           <div className="flex items-center justify-center space-x-3 text-center mb-4">
            <Gem className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
              Diamond Digger
            </h1>
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to continue your diamond digging adventure.
          </p>
        </div>
        <AuthForm />
      </div>
    </div>
  ) : null;
}

// Simple loader, you can replace with a spinner or skeleton screen
function Loader2({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
