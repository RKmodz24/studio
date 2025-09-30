
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import BalanceCard from "./components/balance-card";
import CashoutProgress from "./components/cashout-progress";
import TaskList from "./components/task-list";
import PayoutForm from "./components/payout-form";
import LifetimeEarningsCard from "./components/lifetime-earnings-card";
import { Gem, Gift, Loader2, Users } from "lucide-react";
import type { Task, PayoutDetails } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AdPlayerGame from "./components/candy-crush-game";
import SplashScreen from "./components/splash-screen";
import { copy } from "@/lib/locales";
import { useUser, useAuth } from "@/firebase";

const DIAMONDS_PER_INR = 100;
const MINIMUM_PAYOUT_INR = 500;
const REFERRAL_COMMISSION_RATE = 0.20;

const initialTasks: Omit<Task, 'status' | 'completed'>[] = [
    { id: "1", title: "Daily Check-in", reward: 100, type: "basic" },
    { id: "2", title: "Watch a video ad", reward: 250, type: "ad" },
    { id: "3", title: "Rate our App", reward: 500, type: "basic" },
    { id: "4", title: "Complete a survey", reward: 1000, type: "basic" },
    { id: "5", title: "Watch another video ad", reward: 250, type: "ad" },
    { id: "6", title: "Share app with a friend", reward: 300, type: "basic" },
    { id: "7", title: "Watch a partner ad", reward: 250, type: "ad" },
    { id: "8", title: "Follow us on social media", reward: 150, type: "basic" },
    { id: '47', title: 'Play Ad Game', reward: 0, type: 'game' },
    { id: "10", title: "Watch a tutorial video", reward: 200, type: "ad" },
    { id: "11", title: "Enable push notifications", reward: 400, type: "basic" },
    { id: "12", title: "Complete your profile", reward: 200, type: "basic" },
    { id: "13", title: "Try a new feature", reward: 150, type: "basic" },
    { id: "14", title: "Watch a sponsored video", reward: 300, type: "ad" },
    { id: "15", title: "Leave a review", reward: 450, type: "basic" },
    { id: "16", title: "Refer a user", reward: 1500, type: "basic" },
    { id: "17", title: "View a special offer", reward: 220, type: "ad" },
    { id: "18", title: "Link your email", reward: 350, type: "basic" },
    { id: "19", title: "Weekly challenge", reward: 750, type: "basic" },
    { id: "20", title: "Engage with community post", reward: 80, type: "basic" },
    { id: "21", title: "Watch short ad clip", reward: 150, type: "ad" },
    { id: "22", title: "Join our newsletter", reward: 250, type: "basic" },
    { id: "23", title: "Login for 3 consecutive days", reward: 500, type: "basic" },
    { id: "24", title: "Watch a rewarded ad", reward: 250, type: "ad" },
    { id: "25", title: "Achieve a milestone", reward: 1200, type: "basic" },
    { id: "26", title: "Complete 5 tasks", reward: 400, type: 'basic' },
    { id: "27", title: "Watch 3 video ads", reward: 600, type: 'ad' },
    { id: "28", title: "Update your bio", reward: 50, type: 'basic' },
    { id: "29", title: "Verify your phone number", reward: 300, type: 'basic' },
    { id: "30", title: "Watch a featured ad", reward: 350, type: 'ad' },
    { id: "31", title: "Participate in a poll", reward: 70, type: 'basic' },
    { id: "32", title: "Daily spin wheel", reward: 120, type: 'basic' },
    { id: "33", title: "Watch an interactive ad", reward: 400, type: 'ad' },
    { id: "34", title: "Set a profile picture", reward: 100, type: 'basic' },
    { id: "35", title: "Reach level 5", reward: 1000, type: 'basic' },
    { id: "36", title: "Watch a long-form ad", reward: 500, type: 'ad' },
    { id: "37", title: "Invite 3 friends", reward: 1000, type: 'basic' },
    { id: "38", title: "Complete a quiz", reward: 150, type: 'basic' },
    { id: "39", title: "Watch a brand story ad", reward: 300, type: 'ad' },
    { id: "40", title: "Join a challenge", reward: 600, type: 'basic' },
    { id: "41", title: "Read an article", reward: 60, type: 'basic' },
    { id: "42", title: "Login for 7 consecutive days", reward: 1200, type: 'basic' },
    { id: "43", title: "Watch a premium ad", reward: 500, type: 'ad' },
    { id: "44", title: "Test a new game", reward: 800, type: 'basic' },
    { id: "45", title: "Complete all daily tasks", reward: 1500, type: 'basic' },
    { id: '46', title: 'Apply a referral code', reward: 500, type: 'basic' },
].map(task => ({...task, status: 'incomplete', completed: false } as Task));

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}


export default function Home() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  
  const [diamondBalance, setDiamondBalance] = useState(0);
  const [lifetimeEarnings, setLifetimeEarnings] = useState(0);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [adShownCount, setAdShownCount] = useState(0);
  const [isCashingOut, setIsCashingOut] = useState(false);
  const [balanceKey, setBalanceKey] = useState(0);
  const [isBonusLoading, setIsBonusLoading] = useState(false);
  const [isPayoutFormOpen, setIsPayoutFormOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [commissionEarned, setCommissionEarned] = useState(0);
  const [savedPayoutDetails, setSavedPayoutDetails] = useState<PayoutDetails | null>(null);
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const splashTimer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(splashTimer);
  }, []);

  useEffect(() => {
    const newReferralCode = generateReferralCode();
    setReferralCode(newReferralCode);
    // Store in localStorage so it can be accessed by the /refer page
    if (typeof window !== 'undefined') {
      localStorage.setItem('referralCode', newReferralCode);
    }
  }, []);

  const { toast } = useToast();

  const inrBalance = useMemo(() => diamondBalance / DIAMONDS_PER_INR, [diamondBalance]);
  const progress = useMemo(() => Math.min((inrBalance / MINIMUM_PAYOUT_INR) * 100, 100), [inrBalance]);
  const commissionInr = useMemo(() => commissionEarned / DIAMONDS_PER_INR, [commissionEarned]);

  const pendingTasks = useMemo(() => tasks.filter(t => t.status === 'incomplete'), [tasks]);
  const processingTasks = useMemo(() => tasks.filter(t => t.status === 'processing'), [tasks]);

  const addDiamonds = useCallback((amount: number) => {
    setDiamondBalance((prev) => prev + amount);
    setBalanceKey(prev => prev + 1);
  }, []);
  
  const handleGameReward = useCallback((reward: number) => {
      addDiamonds(reward);
      // No toast here, it's handled inside the game component
  }, [addDiamonds]);

  const handleTaskComplete = useCallback((taskId: string, reward: number, type: Task['type']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'incomplete') return;
    
    if (type === 'game') {
        setIsGameOpen(true);
        return;
    }

    const completeTask = () => {
      if (reward > 0) {
        addDiamonds(reward);
      }
      setTasks(currentTasks =>
        currentTasks.map(t => (t.id === taskId ? { ...t, status: 'completed' } : t))
      );
      toast({
        title: copy.tasks.taskCompleted,
        description: (
          <div className="flex items-center">
            {copy.tasks.taskEarned(reward)} <Gem className="ml-1 h-4 w-4 text-blue-400" />
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
  }, [tasks, addDiamonds, toast, referralCount]);

  const handleSurpriseBonus = async () => {
    setIsBonusLoading(true);
    const adFrequency = adShownCount < 2 ? "low" : adShownCount < 5 ? "medium" : "high";
    toast({ title: copy.toasts.bonusCheck });

    try {
      const result = { showAd: false, reason: 'This is a mock response.'};/*await intelligentAdServing({
        userActivity: 'User clicked on "Surprise Bonus"',
        coinBalance: diamondBalance,
        adFrequency: adFrequency,
      });*/

      if (result.showAd) {
        setAdShownCount((prev) => prev + 1);
        toast({
          title: copy.toasts.adTime,
          description: copy.toasts.adTimeDescription(result.reason),
          duration: 3000,
        });
        setTimeout(() => {
          const bonus = Math.floor(Math.random() * 200) + 50;
          addDiamonds(bonus);
          toast({
            title: copy.toasts.bonusAwarded,
            description: (
              <div className="flex items-center">
                {copy.toasts.bonusReceived(bonus)} <Gem className="ml-1 h-4 w-4 text-blue-400" />
              </div>
            ),
          });
          setIsBonusLoading(false);
        }, 3000);
      } else {
        toast({
          title: copy.toasts.noAd,
          description: result.reason,
        });
        const bonus = Math.floor(Math.random() * 50) + 10;
        addDiamonds(bonus);
        toast({
          title: copy.toasts.smallBonus,
          description: (
             <div className="flex items-center">
              {copy.toasts.smallBonusDescription(bonus)} <Gem className="ml-1 h-4 w-4 text-blue-400" />
            </div>
          ),
        });
        setIsBonusLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: copy.toasts.error,
        description: copy.toasts.adServerError,
      });
      setIsBonusLoading(false);
    }
  };

  const handleCashout = () => {
    if (inrBalance >= MINIMUM_PAYOUT_INR) {
      setIsPayoutFormOpen(true);
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
      setLifetimeEarnings(prev => prev + amountToCashout);
      setDiamondBalance(0);
      setCommissionEarned(0);
      if (typeof window !== 'undefined') {
          localStorage.setItem('referralCount', '0');
          localStorage.setItem('commissionEarned', '0');
      }
      setIsCashingOut(false);
      setTasks(initialTasks.map(t => ({...t, status: 'incomplete', completed: false} as Task)));
      toast({
        title: copy.toasts.cashoutSuccess,
        description: copy.toasts.cashoutSuccessDescription,
      });
    }, 2000);
  };

  const HomeContent = (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <header className="flex items-center justify-between">
          <div className="flex items-center space-x-3 text-center">
            <Gem className="h-8 w-8 text-primary" />
            <h1 className="font-headline text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
              {copy.appName}
            </h1>
          </div>
          {!isUserLoading && !user && (
            <Button variant="outline" onClick={() => router.push('/signup')}>
              Sign Up
            </Button>
          )}
        </header>

        <LifetimeEarningsCard lifetimeEarnings={lifetimeEarnings} />

        <BalanceCard 
          diamondBalance={diamondBalance} 
          inrBalance={inrBalance}
          balanceKey={balanceKey}
        />
        
        <Button variant="outline" className="w-full" onClick={() => router.push('/refer')}>
          <Users className="mr-2 h-4 w-4" />
          {copy.referral.button}
        </Button>

        <CashoutProgress
          progress={progress}
          inrBalance={inrBalance}
          minPayout={MINIMUM_PAYOUT_INR}
          onCashout={handleCashout}
          isCashingOut={isCashingOut}
        />

        <div className="space-y-4">
          {processingTasks.length > 0 && (
            <div>
              <h2 className="font-headline text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Loader2 className="mr-2 h-5 w-5 animate-spin"/>
                {copy.tasks.processing}
              </h2>
              <TaskList tasks={processingTasks} onCompleteTask={handleTaskComplete} listId="processing" />
            </div>
          )}

          <div className="flex justify-between items-center">
            <h2 className="font-headline text-2xl font-semibold text-gray-700 dark:text-gray-300">{copy.tasks.title}</h2>
             <Button onClick={handleSurpriseBonus} disabled={isBonusLoading}>
              {isBonusLoading ? <Loader2 className="animate-spin" /> : <Gift />}
              {copy.tasks.surpriseBonus}
            </Button>
          </div>
          <TaskList tasks={pendingTasks} onCompleteTask={handleTaskComplete} listId="pending" />
        </div>
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

    