"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { intelligentAdServing } from "@/ai/flows/intelligent-ad-serving";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import BalanceCard from "./components/balance-card";
import CashoutProgress from "./components/cashout-progress";
import TaskList from "./components/task-list";
import PayoutForm from "./components/payout-form";
import LifetimeEarningsCard from "./components/lifetime-earnings-card";
import ReferralCard from "./components/referral-card";
import { Gem, Gift, Loader2 } from "lucide-react";
import type { Task, PayoutDetails } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

const DIAMONDS_PER_INR = 100;
const MINIMUM_PAYOUT_INR = 100;
const REFERRAL_COMMISSION_RATE = 0.20;

const initialTasks: Task[] = [
    { id: "1", title: "Daily Check-in", reward: 100, completed: false, type: "basic" },
    { id: "2", title: "Watch a video ad", reward: 250, completed: false, type: "ad" },
    { id: "3", title: "Rate our App", reward: 500, completed: false, type: "basic" },
    { id: "4", title: "Complete a survey", reward: 1000, completed: false, type: "basic" },
    { id: "5", title: "Watch another video ad", reward: 250, completed: false, type: "ad" },
    { id: "6", title: "Share app with a friend", reward: 300, completed: false, type: "basic" },
    { id: "7", title: "Watch a partner ad", reward: 250, completed: false, type: "ad" },
    { id: "8", title: "Follow us on social media", reward: 150, completed: false, type: "basic" },
    { id: "9", title: "Play a mini-game", reward: 50, completed: false, type: "basic" },
    { id: "10", title: "Watch a tutorial video", reward: 200, completed: false, type: "ad" },
    { id: "11", title: "Enable push notifications", reward: 400, completed: false, type: "basic" },
    { id: "12", title: "Complete your profile", reward: 200, completed: false, type: "basic" },
    { id: "13", title: "Try a new feature", reward: 150, completed: false, type: "basic" },
    { id: "14", title: "Watch a sponsored video", reward: 300, completed: false, type: "ad" },
    { id: "15", title: "Leave a review", reward: 450, completed: false, type: "basic" },
    { id: "16", title: "Refer a user", reward: 1500, completed: false, type: "basic" },
    { id: "17", title: "View a special offer", reward: 220, completed: false, type: "ad" },
    { id: "18", title: "Link your email", reward: 350, completed: false, type: "basic" },
    { id: "19", title: "Weekly challenge", reward: 750, completed: false, type: "basic" },
    { id: "20", title: "Engage with community post", reward: 80, completed: false, type: "basic" },
    { id: "21", title: "Watch short ad clip", reward: 150, completed: false, type: "ad" },
    { id: "22", title: "Join our newsletter", reward: 250, completed: false, type: "basic" },
    { id: "23", title: "Login for 3 consecutive days", reward: 500, completed: false, type: "basic" },
    { id: "24", title: "Watch a rewarded ad", reward: 250, completed: false, type: "ad" },
    { id: "25", title: "Achieve a milestone", reward: 1200, completed: false, type: "basic" },
    { id: "26", title: "Complete 5 tasks", reward: 400, completed: false, type: 'basic' },
    { id: "27", title: "Watch 3 video ads", reward: 600, completed: false, type: 'ad' },
    { id: "28", title: "Update your bio", reward: 50, completed: false, type: 'basic' },
    { id: "29", title: "Verify your phone number", reward: 300, completed: false, type: 'basic' },
    { id: "30", title: "Watch a featured ad", reward: 350, completed: false, type: 'ad' },
    { id: "31", title: "Participate in a poll", reward: 70, completed: false, type: 'basic' },
    { id: "32", title: "Daily spin wheel", reward: 120, completed: false, type: 'basic' },
    { id: "33", title: "Watch an interactive ad", reward: 400, completed: false, type: 'ad' },
    { id: "34", title: "Set a profile picture", reward: 100, completed: false, type: 'basic' },
    { id: "35", title: "Reach level 5", reward: 1000, completed: false, type: 'basic' },
    { id: "36", title: "Watch a long-form ad", reward: 500, completed: false, type: 'ad' },
    { id: "37", title: "Invite 3 friends", reward: 1000, completed: false, type: 'basic' },
    { id: "38", title: "Complete a quiz", reward: 150, completed: false, type: 'basic' },
    { id: "39", title: "Watch a brand story ad", reward: 300, completed: false, type: 'ad' },
    { id: "40", title: "Join a challenge", reward: 600, completed: false, type: 'basic' },
    { id: "41", title: "Read an article", reward: 60, completed: false, type: 'basic' },
    { id: "42", title: "Login for 7 consecutive days", reward: 1200, completed: false, type: 'basic' },
    { id: "43", title: "Watch a premium ad", reward: 500, completed: false, type: 'ad' },
    { id: "44", title: "Test a new game", reward: 800, completed: false, type: 'basic' },
    { id: "45", title: "Complete all daily tasks", reward: 1500, completed: false, type: 'basic' },
    { id: '46', title: 'Apply a referral code', reward: 500, completed: false, type: 'basic' },
];

function generateReferralCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}


export default function Home() {
  const [diamondBalance, setDiamondBalance] = useState(0);
  const [lifetimeEarnings, setLifetimeEarnings] = useState(0);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [adShownCount, setAdShownCount] = useState(0);
  const [isCashingOut, setIsCashingOut] = useState(false);
  const [balanceKey, setBalanceKey] = useState(0);
  const [isBonusLoading, setIsBonusLoading] = useState(false);
  const [isPayoutFormOpen, setIsPayoutFormOpen] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const [commissionEarned, setCommissionEarned] = useState(0);

  useEffect(() => {
    setReferralCode(generateReferralCode());
  }, []);

  const { toast } = useToast();

  const inrBalance = useMemo(() => diamondBalance / DIAMONDS_PER_INR, [diamondBalance]);
  const progress = useMemo(() => Math.min((inrBalance / MINIMUM_PAYOUT_INR) * 100, 100), [inrBalance]);
  const commissionInr = useMemo(() => commissionEarned / DIAMONDS_PER_INR, [commissionEarned]);

  const addDiamonds = useCallback((amount: number) => {
    setDiamondBalance((prev) => prev + amount);
    setBalanceKey(prev => prev + 1);
  }, []);

  const handleTaskComplete = useCallback((taskId: string, reward: number, type: 'basic' | 'ad') => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.completed) return;

    const completeTask = () => {
      addDiamonds(reward);
      setTasks(currentTasks =>
        currentTasks.map(t => (t.id === taskId ? { ...t, completed: true } : t))
      );
      toast({
        title: "Task Completed!",
        description: (
          <div className="flex items-center">
            You've earned {reward} <Gem className="ml-1 h-4 w-4 text-blue-400" />
          </div>
        ),
      });

      // Simulate referral commission
      if (referralCount > 0 && taskId !== '46') {
        const commission = Math.floor(reward * REFERRAL_COMMISSION_RATE);
        addDiamonds(commission);
        setCommissionEarned(prev => prev + commission);
        toast({
          title: "Referral Bonus!",
          description: `You earned ${commission} diamonds from a referral's activity.`,
        });
      }

      if (taskId === '46') {
        setReferralCount(prev => prev + 1);
        toast({
          title: "Referral Applied!",
          description: "You've successfully referred a new user!",
        });
      }
    }

    if(type === 'ad'){
      toast({ title: "Watching ad..." });
      setTimeout(() => {
        completeTask();
      }, 2000);
    } else {
      completeTask();
    }
  }, [tasks, addDiamonds, toast, referralCount]);

  const handleSurpriseBonus = async () => {
    setIsBonusLoading(true);
    const adFrequency = adShownCount < 2 ? "low" : adShownCount < 5 ? "medium" : "high";
    toast({ title: "Checking for a bonus..." });

    try {
      const result = await intelligentAdServing({
        userActivity: 'User clicked on "Surprise Bonus"',
        coinBalance: diamondBalance,
        adFrequency: adFrequency,
      });

      if (result.showAd) {
        setAdShownCount((prev) => prev + 1);
        toast({
          title: "Ad Time!",
          description: `Reason: ${result.reason}. You will be rewarded after the ad.`,
          duration: 3000,
        });
        setTimeout(() => {
          const bonus = Math.floor(Math.random() * 200) + 50;
          addDiamonds(bonus);
          toast({
            title: "Bonus Awarded!",
            description: (
              <div className="flex items-center">
                You received {bonus} <Gem className="ml-1 h-4 w-4 text-blue-400" />
              </div>
            ),
          });
          setIsBonusLoading(false);
        }, 3000);
      } else {
        toast({
          title: "No ad this time.",
          description: result.reason,
        });
        const bonus = Math.floor(Math.random() * 50) + 10;
        addDiamonds(bonus);
        toast({
          title: "Small Bonus!",
          description: (
             <div className="flex items-center">
              You received a small bonus of {bonus} <Gem className="ml-1 h-4 w-4 text-blue-400" />
            </div>
          ),
        });
        setIsBonusLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Could not contact our ad server.",
      });
      setIsBonusLoading(false);
    }
  };

  const handleCashout = () => {
    if (inrBalance >= MINIMUM_PAYOUT_INR) {
      setIsPayoutFormOpen(true);
    }
  };

  const processCashout = (details: PayoutDetails) => {
    setIsCashingOut(true);
    setIsPayoutFormOpen(false);
    const amountToCashout = inrBalance;
    let description = "";
    if (details.payoutType === 'bank') {
      description = `Cashing out ₹${amountToCashout.toFixed(2)} to ${details.accountHolderName}.`;
    } else {
      description = `Cashing out ₹${amountToCashout.toFixed(2)} to UPI ID: ${details.upiId}.`;
    }
    toast({
      title: "Processing Cashout...",
      description: description,
    });
    setTimeout(() => {
      setLifetimeEarnings(prev => prev + amountToCashout);
      setDiamondBalance(0);
      setCommissionEarned(0);
      setIsCashingOut(false);
      setTasks(initialTasks.map(t => ({...t, completed: false})));
      toast({
        title: "Success!",
        description: "Your cashout request has been processed.",
      });
    }, 2000);
  }


  return (
    <main className="flex min-h-screen flex-col items-center bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md space-y-6">
        <header className="flex items-center justify-center space-x-3 text-center">
          <Gem className="h-8 w-8 text-primary" />
          <h1 className="font-headline text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
            Diamond Digger
          </h1>
        </header>

        <LifetimeEarningsCard lifetimeEarnings={lifetimeEarnings} />

        <BalanceCard 
          diamondBalance={diamondBalance} 
          inrBalance={inrBalance}
          balanceKey={balanceKey}
        />
        
        <ReferralCard 
          referralCode={referralCode}
          referralCount={referralCount}
          commissionEarned={commissionInr}
        />

        <CashoutProgress
          progress={progress}
          inrBalance={inrBalance}
          minPayout={MINIMUM_PAYOUT_INR}
          onCashout={handleCashout}
          isCashingOut={isCashingOut}
        />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-headline text-2xl font-semibold text-gray-700 dark:text-gray-300">Tasks</h2>
             <Button onClick={handleSurpriseBonus} disabled={isBonusLoading}>
              {isBonusLoading ? <Loader2 className="animate-spin" /> : <Gift />}
              Surprise Bonus
            </Button>
          </div>
          <TaskList tasks={tasks} onCompleteTask={handleTaskComplete} />
        </div>
      </div>
      <Dialog open={isPayoutFormOpen} onOpenChange={setIsPayoutFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter Payout Details</DialogTitle>
            <DialogDescription>
              Choose your preferred payout method and provide the necessary details.
            </DialogDescription>
          </DialogHeader>
          <PayoutForm
            amount={inrBalance}
            onSubmit={processCashout}
            isProcessing={isCashingOut}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
}
