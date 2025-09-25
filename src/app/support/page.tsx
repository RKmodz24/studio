
"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AICustomerCareChat from "@/app/components/ai-customer-care";
import { copy } from "@/lib/locales";

export default function SupportPage() {
  const router = useRouter();

  return (
    <main className="flex h-screen flex-col items-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl mx-auto flex-1 flex flex-col">
        <header className="relative flex items-center justify-between border-b p-4">
          <Button variant="ghost" size="icon" className="absolute left-2 sm:left-4" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="text-center w-full">
            <h1 className="font-headline text-xl font-bold">{copy.support.title}</h1>
            <p className="text-sm text-muted-foreground">{copy.support.description}</p>
          </div>
        </header>
        
        <div className="flex-1 overflow-hidden">
          <AICustomerCareChat />
        </div>
      </div>
    </main>
  );
}
