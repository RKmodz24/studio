
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import TaskList from "./components/task-list";
import PayoutForm from "./components/payout-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CircleDollarSign,
  Gift,
  Loader2,
  Wallet,
  RefreshCw,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import type { Task, PayoutDetails } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AdPlayerGame from "./components/candy-crush-game";
import SplashScreen from "./components/splash-screen";
import { copy } from "@/lib/locales";
import { useUser } from "@/firebase";

const DIAMONDS_PER_INR = 100;
const MINIMUM_PAYOUT_INR = 500;
const TEST_WITHDRAWAL_INR = 1;
const TEST_WITHDRAWAL_DIAMONDS = TEST_WITHDRAWAL_INR * DIAMONDS_PER_INR;
const ADS_FOR_TEST_WITHDRAWAL = 5;
const REFERRAL_COMMISSION_RATE = 0.20;

const initialTasks: Omit<Task, 'status' | 'completed'>[] = [
    { id: "daily_1", title: "Daily Check-in", reward: 100, type: "basic" },
    { id: "daily_3", title: "Install Rapido & Ride", reward: 3000, type: "offer", offerId: "install-jar-app", icon: "https://i.imgur.com/8aVwf2s.png", description: "Install the app and complete a ride" },
    { id: "1", title: "Play & Win up to 100,000 Diamonds!", reward: 0, type: 'game' },
    { id: 'instagram_follow', title: 'Follow us on Instagram!', reward: 5000, type: 'link', description: 'Get a bonus for following our page!', link: 'https://www.instagram.com/golden_hours24__?igsh=MTh3aWJtOXlldG0xbA==', highlighted: true },
    { id: "3", title: "Rate our App", reward: 500, type: "basic" },
    { id: "4", title: "Complete a survey", reward: 1000, type: "basic" },
    { id: "6", title: "Share app with a friend", reward: 300, type: "basic" },
    { id: "16", title: "Refer a user", reward: 1100, type: "basic" },
    { id: '46', title: 'Apply a referral code', reward: 500, type: 'basic' },
];


function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}


export default function Home() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  
  const [diamondBalance, setDiamondBalance] = useState(0);
  const [inrBalance, setInrBalance] = useState(0);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCashingOut, setIsCashingOut] = useState(false);
  const [isTestCashingOut, setIsTestCashingOut] = useState(false);
  const [balanceKey, setBalanceKey] = useState(0);
  const [isPayoutFormOpen, setIsPayoutFormOpen] = useState(false);
  const [isTestPayoutFormOpen, setIsTestPayoutFormOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [commissionEarned, setCommissionEarned] = useState(0);
  const [savedPayoutDetails, setSavedPayoutDetails] = useState<PayoutDetails | null>(null);
  const [showSplash, setShowSplash] = useState(true);
  const [adsWatchedForTestWithdrawal, setAdsWatchedForTestWithdrawal] = useState(0);
  const [testWithdrawalCompleted, setTestWithdrawalCompleted] = useState(false);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  const loadTasks = () => {
    let storedTasks: Task[] = [];
    const storedTasksString = localStorage.getItem('tasks');
    if (storedTasksString) {
        storedTasks = JSON.parse(storedTasksString);
    }

    const allTaskIds = new Set(storedTasks.map(t => t.id));
    const newTasks = initialTasks
      .filter(t => !allTaskIds.has(t.id))
      .map(task => ({ ...task, status: 'incomplete' } as Task));
    
    const updatedTasks = [...storedTasks, ...newTasks];
    setTasks(updatedTasks);
  };

  useEffect(() => {
    loadTasks();
    const adsWatched = parseInt(localStorage.getItem('adsWatchedForTestWithdrawal') || '0', 10);
    setAdsWatchedForTestWithdrawal(adsWatched);
    const withdrawalCompleted = localStorage.getItem('testWithdrawalCompleted') === 'true';
    setTestWithdrawalCompleted(withdrawalCompleted);
  }, []);

  useEffect(() => {
    // Save tasks to local storage whenever they change
    if (tasks.length > 0) {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  }, [tasks]);

  useEffect(() => {
    const newReferralCode = generateReferralCode();
    setReferralCode(newReferralCode);
    // Store in localStorage so it can be accessed by the /refer page
    if (typeof window !== 'undefined') {
      localStorage.setItem('referralCode', newReferralCode);
    }
  }, []);

  const { toast } = useToast();

  useEffect(() => {
    setInrBalance(diamondBalance / DIAMONDS_PER_INR);
  }, [diamondBalance]);

  const progress = useMemo(() => Math.min((inrBalance / MINIMUM_PAYOUT_INR) * 100, 100), [inrBalance]);
  const testWithdrawalProgress = useMemo(() => Math.min((adsWatchedForTestWithdrawal / ADS_FOR_TEST_WITHDRAWAL) * 100, 100), [adsWatchedForTestWithdrawal]);

  const anytimeTasks = useMemo(() => tasks.filter(t => t.status !== 'completed'), [tasks]);

  const addDiamonds = useCallback((amount: number) => {
    setDiamondBalance((prev) => prev + amount);
    setBalanceKey(prev => prev + 1);
  }, []);
  
  const handleGameReward = useCallback((reward: number) => {
      addDiamonds(reward);
      // No toast here, it's handled inside the game component
  }, [addDiamonds]);

  const handleTaskComplete = useCallback((taskId: string, reward: number, type: Task['type'], offerId?: string, link?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'incomplete') return;
    
    if (type === 'game') {
        setIsGameOpen(true);
        return;
    }

    if (type === 'offer' && offerId) {
        router.push(`/offer/${offerId}`);
        return;
    }

    if (type === 'link' && link) {
      window.open(link, '_blank');
    }

    const completeTask = () => {
      if (reward > 0) {
        addDiamonds(reward);
      }
      
      const newAdTask: Task = {
        id: `ad_${new Date().getTime()}`,
        title: "Watch a video ad",
        reward: 250,
        type: "ad",
        status: 'incomplete'
      };

      setTasks(currentTasks => {
        const completedTask = currentTasks.find(t => t.id === taskId);
        let updatedTasks = currentTasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t);
        
        let finalTasks = updatedTasks.filter(t => t.status !== 'completed');

        // Add a new ad task only if the completed task was not the instagram follow task
        if (completedTask && completedTask.id !== 'instagram_follow') {
            finalTasks.push(newAdTask);
        }

        return finalTasks;
      });

      if (type === 'ad') {
        setAdsWatchedForTestWithdrawal(prev => {
            const newCount = prev + 1;
            localStorage.setItem('adsWatchedForTestWithdrawal', String(newCount));
            return newCount;
        });
      }

      toast({
        title: copy.tasks.taskCompleted,
        description: (
          <div className="flex items-center">
            {copy.tasks.taskEarned(reward)} <CircleDollarSign className="ml-1 h-4 w-4 text-yellow-500" />
          </div>
        ),
      });

      // Simulate referral commission
      if (referralCount > 0 && taskId !== '46') {
        const commission = Math.floor(reward * REFERRAL_COMMISSION_RATE);
        addDiamonds(commission);
        setCommissionEarned(prev => {
            const newCommission = prev + commission;
            if (typeof window !== 'undefined') {
                localStorage.setItem('commissionEarned', String(newCommission / DIAMONDS_PER_INR));
            }
            return newCommission;
        });
        toast({
          title: copy.toasts.referralBonus,
          description: copy.toasts.referralBonusDescription(commission),
        });
      }

      if (taskId === '46') {
        setReferralCount(prev => {
            const newCount = prev + 1;
            if (typeof window !== 'undefined') {
                localStorage.setItem('referralCount', String(newCount));
            }
            return newCount;
        });
        toast({
          title: copy.toasts.referralApplied,
          description: copy.toasts.referralAppliedDescription,
        });
      }
    }

    if(type === 'ad'){
      setTasks(currentTasks => currentTasks.map(t => t.id === taskId ? { ...t, status: 'processing' } : t));
      toast({ title: copy.toasts.watchingAd });
      setTimeout(() => {
        completeTask();
      }, 2000);
    } else {
      // For basic tasks, we can show a brief processing state for visual feedback
      setTasks(currentTasks => currentTasks.map(t => t.id === taskId ? { ...t, status: 'processing' } : t));
      setTimeout(() => {
        completeTask();
      }, 300);
    }
  }, [tasks, addDiamonds, toast, referralCount, router]);

  const handleCashout = () => {
    if (inrBalance >= MINIMUM_PAYOUT_INR) {
      setIsPayoutFormOpen(true);
    } else {
        toast({
            variant: "destructive",
            title: "Cashout Not Available",
            description: `You need at least ₹${MINIMUM_PAYOUT_INR.toFixed(2)} to cash out.`,
        });
    }
  };

  const handleTestCashout = () => {
    if (diamondBalance >= TEST_WITHDRAWAL_DIAMONDS && adsWatchedForTestWithdrawal >= ADS_FOR_TEST_WITHDRAWAL) {
      setIsTestPayoutFormOpen(true);
    } else {
      toast({
        variant: "destructive",
        title: "Test Cashout Not Available",
        description: `You need to watch ${ADS_FOR_TEST_WITHDRAWAL} ads and have at least ${TEST_WITHDRAWAL_DIAMONDS} diamonds.`,
      });
    }
  };

  const processCashout = (details: PayoutDetails, remember: boolean) => {
    setIsCashingOut(true);
    setIsPayoutFormOpen(false);

    if (remember) {
      setSavedPayoutDetails(details);
    } else {
      setSavedPayoutDetails(null);
    }
    
    const amountToCashout = inrBalance;
    let description = "";
    if (details.payoutType === 'bank') {
      description = copy.toasts.cashoutProcessingBank(amountToCashout, details.accountHolderName);
    } else if (details.payoutType === 'upi') {
      description = copy.toasts.cashoutProcessingUpi(amountToCashout, details.upiId);
    } else if (details.payoutType === 'paypal') {
        description = copy.toasts.cashoutProcessingPayPal(amountToCashout, details.paypalEmail);
    }
    toast({
      title: copy.toasts.cashoutProcessing,
      description: description,
    });
    setTimeout(() => {
      setDiamondBalance(0);
      setCommissionEarned(0);
      if (typeof window !== 'undefined') {
          localStorage.setItem('referralCount', '0');
          localStorage.setItem('commissionEarned', '0');
      }
      setIsCashingOut(false);
      // Reset all tasks on cashout
      const allTasks = initialTasks.map(t => ({...t, status: 'incomplete' } as Task));
      setTasks(allTasks);
      toast({
        title: copy.toasts.cashoutSuccess,
        description: copy.toasts.cashoutSuccessDescription,
      });
    }, 2000);
  };
  
    const processTestCashout = (details: PayoutDetails, remember: boolean) => {
    setIsTestCashingOut(true);
    setIsTestPayoutFormOpen(false);

    if (remember && !savedPayoutDetails) {
      setSavedPayoutDetails(details);
    }
    
    const amountToCashout = TEST_WITHDRAWAL_INR;
    let description = "";
    if (details.payoutType === 'bank') {
      description = copy.toasts.cashoutProcessingBank(amountToCashout, details.accountHolderName);
    } else if (details.payoutType === 'upi') {
      description = copy.toasts.cashoutProcessingUpi(amountToCashout, details.upiId);
    } else if (details.payoutType === 'paypal') {
      description = copy.toasts.cashoutProcessingPayPal(amountToCashout, details.paypalEmail);
    }
    toast({
      title: copy.toasts.cashoutProcessing,
      description: description,
    });
    setTimeout(() => {
      setDiamondBalance(prev => prev - TEST_WITHDRAWAL_DIAMONDS);
      setIsTestCashingOut(false);
      setTestWithdrawalCompleted(true);
      localStorage.setItem('testWithdrawalCompleted', 'true');
      toast({
        title: copy.toasts.cashoutSuccess,
        description: `Your test cashout of ₹${amountToCashout.toFixed(2)} has been processed.`,
      });
    }, 2000);
  };

  const handleRefreshTasks = () => {
    localStorage.removeItem('tasks');
    setTasks(initialTasks.map(task => ({ ...task, status: 'incomplete' } as Task)));
    toast({
      title: "Tasks Refreshed",
      description: "You have a new set of tasks.",
    });
  };
  
  const HomeContent = (
    <main className="flex min-h-screen flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <header className="flex items-center justify-between text-center">
          <div className="flex-1 text-left"></div>
          <div className="flex-1 text-center">
            <h1 className="font-headline text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
              {copy.appName}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {copy.appDescription}
            </p>
          </div>
          <div className="flex-1 text-right">
             <Button variant="ghost" size="icon" onClick={handleRefreshTasks}>
                <RefreshCw className="h-5 w-5" />
             </Button>
          </div>
        </header>

        {!isUserLoading && !user && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4" role="alert">
                <p className="font-bold">Welcome, Guest!</p>
                <p>Please <button onClick={() => router.push('/signup')} className="underline font-semibold">sign up</button> to save your progress and cash out.</p>
            </div>
        )}

        <div className="flex space-x-4">
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{copy.balance.diamonds}</CardTitle>
              <CircleDollarSign className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div key={balanceKey} className="text-2xl font-bold animate-in fade-in-0 slide-in-from-top-4 duration-500">
                {diamondBalance.toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="flex-1">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{copy.balance.balance}</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div key={balanceKey} className="text-2xl font-bold animate-in fade-in-0 slide-in-from-top-4 duration-500">
                ₹{inrBalance.toFixed(2)}
              </div>
            </CardContent>
          </Card>
        </div>

        {!testWithdrawalCompleted && (
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-primary" />
                <CardTitle>{copy.testCashout.title}</CardTitle>
              </div>
              <CardDescription>
                {copy.testCashout.description(ADS_FOR_TEST_WITHDRAWAL, TEST_WITHDRAWAL_INR)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress value={testWithdrawalProgress} />
              <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
                {adsWatchedForTestWithdrawal} / {ADS_FOR_TEST_WITHDRAWAL} ads watched
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleTestCashout} 
                disabled={isTestCashingOut || adsWatchedForTestWithdrawal < ADS_FOR_TEST_WITHDRAWAL || diamondBalance < TEST_WITHDRAWAL_DIAMONDS} 
                className="w-full"
              >
                {isTestCashingOut ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {copy.cashout.buttonProcessing}
                  </>
                ) : (
                  copy.testCashout.button(TEST_WITHDRAWAL_INR)
                )}
              </Button>
            </CardFooter>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>{copy.cashout.title}</CardTitle>
            <CardDescription>
              {copy.cashout.description(MINIMUM_PAYOUT_INR)}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} />
            <div className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400">
              ₹{inrBalance.toFixed(2)} / ₹{MINIMUM_PAYOUT_INR.toFixed(2)}
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <Button onClick={handleCashout} disabled={isCashingOut || inrBalance < MINIMUM_PAYOUT_INR} className="w-full">
              {isCashingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {copy.cashout.buttonProcessing}
                </>
              ) : (
                copy.cashout.button
              )}
            </Button>
            <Button onClick={() => router.push('/refer')} variant="outline" className="w-full">
              {copy.referral.button}
            </Button>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <h2 className="font-headline text-xl font-semibold text-gray-800 dark:text-gray-200">{copy.tasks.title}</h2>
          <TaskList tasks={anytimeTasks} onCompleteTask={handleTaskComplete} listId="anytime" />
        </div>
        
        <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4 pb-20">
            <p>&copy; {new Date().getFullYear()} {copy.appName}. All rights reserved.</p>
            <p>
                <a href="/disclaimer" className="underline">Disclaimer</a>
            </p>
        </footer>
      </div>
      
      <Dialog open={isPayoutFormOpen} onOpenChange={setIsPayoutFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.cashout.payoutTitle}</DialogTitle>
            <DialogDescription>
             {copy.cashout.payoutDescription}
            </DialogDescription>
          </DialogHeader>
          <PayoutForm
            amount={inrBalance}
            onSubmit={processCashout}
            isProcessing={isCashingOut}
            savedDetails={savedPayoutDetails}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isTestPayoutFormOpen} onOpenChange={setIsTestPayoutFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{copy.testCashout.payoutTitle}</DialogTitle>
            <DialogDescription>
             {copy.cashout.payoutDescription}
            </DialogDescription>
          </DialogHeader>
          <PayoutForm
            amount={TEST_WITHDRAWAL_INR}
            onSubmit={processTestCashout}
            isProcessing={isTestCashingOut}
            savedDetails={savedPayoutDetails}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isGameOpen} onOpenChange={setIsGameOpen}>
        <DialogContent className="max-w-sm">
            <DialogHeader>
                <DialogTitle>{copy.adGame.title}</DialogTitle>
                <DialogDescription>
                    {copy.adGame.description}
                </DialogDescription>
            </DialogHeader>
            <AdPlayerGame onReward={handleGameReward} />
        </DialogContent>
      </Dialog>

      <Button
        onClick={() => window.open('https://t.me/A2Z_Growth', '_blank')}
        className="fixed bottom-20 right-4 h-14 w-14 rounded-full shadow-lg"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    </main>
  );
  
  if (showSplash) {
    return <SplashScreen />;
  }

  if (isUserLoading) {
     return <SplashScreen />;
  }

  return HomeContent;
}

    