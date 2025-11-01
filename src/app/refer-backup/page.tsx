
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Copy, Users, Award, CircleDollarSign } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { copy } from "@/lib/locales";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ReferPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [referralLink, setReferralLink] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [commissionEarned, setCommissionEarned] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We use localStorage to pass state between pages as a simple solution
    // for this prototype. In a real app, you might use a global state manager.
    const storedCode = localStorage.getItem('referralCode');
    const storedCount = localStorage.getItem('referralCount');
    const storedCommission = localStorage.getItem('commissionEarned');

    if (storedCode) {
      setReferralCode(storedCode);
      const baseUrl = "https://golden-hours-app.apphosting.dev";
      setReferralLink(`${baseUrl}/?ref=${storedCode}`);
    }
    if (storedCount) {
      setReferralCount(Number(storedCount));
    }
    if (storedCommission) {
      setCommissionEarned(Number(storedCommission));
    }
    setIsLoading(false);
  }, []);

  const handleCopy = (textToCopy: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: copy.referral.copied,
      description: copy.referral.copiedDescription(type),
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <header className="relative flex items-center justify-center">
          <Button variant="ghost" size="icon" className="absolute left-0" onClick={() => router.push('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="font-headline text-2xl font-bold">{copy.referral.title}</h1>
        </header>

        {isLoading ? (
          <Card className="shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="flex justify-around pt-2">
                <div className="flex flex-col items-center space-y-1">
                  <Skeleton className="h-6 w-12" />
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="flex flex-col items-center space-y-1">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">{copy.referral.title}</CardTitle>
              <CardDescription>{copy.referral.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="border-accent bg-accent/10">
                <Award className="h-5 w-5 text-accent" />
                <AlertTitle className="text-accent">{copy.referral.bonusTitle}</AlertTitle>
                <AlertDescription className="text-accent/90">
                  {copy.referral.bonusDescription}
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{copy.referral.codeLabel}</label>
                  <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <span className="font-mono text-lg font-semibold text-primary">{referralCode}</span>
                    <Button variant="ghost" size="icon" onClick={() => handleCopy(referralCode, 'code')}>
                      <Copy className="h-5 w-5" />
                    </Button>
                  </div>
              </div>
              <div className="space-y-2">
                  <label htmlFor="referralLink" className="text-sm font-medium text-muted-foreground">{copy.referral.linkLabel}</label>
                  <div className="flex items-center space-x-2">
                      <Input id="referralLink" value={referralLink} readOnly className="bg-gray-100 dark:bg-gray-800" />
                      <Button variant="outline" size="icon" onClick={() => handleCopy(referralLink, 'link')}>
                          <Copy className="h-5 w-5" />
                      </Button>
                  </div>
              </div>
              <div className="flex justify-around text-center pt-2">
                  <div className="flex items-center space-x-2">
                      <Users className="h-6 w-6 text-muted-foreground" />
                      <div>
                          <p className="font-bold text-xl">{referralCount}</p>
                          <p className="text-xs text-muted-foreground">{copy.referral.referrals}</p>
                      </div>
                  </div>
                  <div className="flex items-center space-x-2">
                      <Award className="h-6 w-6 text-muted-foreground" />
                      <div>
                          <p className="font-bold text-xl">₹{commissionEarned.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">{copy.referral.commission}</p>
                      </div>
                  </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

    