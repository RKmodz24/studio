
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import TaskList from "./components/task-list";
import PayoutForm from "./components/payout-form";
import {
  CircleDollarSign,
  Gift,
  Loader2,
  Wallet,
  Star,
  CheckCircle,
  ShoppingBag,
  Users,
  BadgePercent,
} from "lucide-react";
import type { Task, PayoutDetails } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import AdPlayerGame from "./components/candy-crush-game";
import SplashScreen from "./components/splash-screen";
import { copy } from "@/lib/locales";
import { useUser } from "@/firebase";
import CircularProgress from "./components/circular-progress";
import BottomNav from "./components/bottom-nav";
import Image from "next/image";

const DIAMONDS_PER_INR = 100;
const MINIMUM_PAYOUT_INR = 500;
const REFERRAL_COMMISSION_RATE = 0.20;

const initialTasks: Omit<Task, 'status' | 'completed'>[] = [
    { id: "withdraw", title: "Withdrawal offer", reward: 0, type: "withdraw" },
    { id: "daily_1", title: "Daily Check-in", reward: 100, type: "basic" },
    { id: "daily_2", title: "Watch a video ad", reward: 250, type: "ad" },
    { id: "daily_3", title: "Install App & Register", reward: 1500, type: "offer", offerId: "install-jar-app", icon: "/jar-icon.png", description: "Complete autopay setup" },
    { id: "1", title: "Play & Win up to 100,000 Diamonds!", reward: 0, type: 'game' },
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
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isCashingOut, setIsCashingOut] = useState(false);
  const [balanceKey, setBalanceKey] = useState(0);
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

  const inrBalance = useMemo(() => diamondBalance / DIAMONDS_PER_INR, [diamondBalance]);
  const progress = useMemo(() => Math.min((inrBalance / MINIMUM_PAYOUT_INR) * 100, 100), [inrBalance]);

  const anytimeTasks = useMemo(() => tasks.filter(t => t.status !== 'completed'), [tasks]);

  const addDiamonds = useCallback((amount: number) => {
    setDiamondBalance((prev) => prev + amount);
    setBalanceKey(prev => prev + 1);
  }, []);
  
  const handleGameReward = useCallback((reward: number) => {
      addDiamonds(reward);
      // No toast here, it's handled inside the game component
  }, [addDiamonds]);

  const handleTaskComplete = useCallback((taskId: string, reward: number, type: Task['type'], offerId?: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task || task.status !== 'incomplete') return;
    
    if (type === 'game') {
        setIsGameOpen(true);
        return;
    }

    if (type === 'withdraw') {
        handleCashout();
        return;
    }

    if (type === 'offer' && offerId) {
        router.push(`/offer/${offerId}`);
        return;
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

      setTasks(currentTasks => [
        ...currentTasks.filter(t => t.id !== taskId),
        newAdTask
      ]);

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
  
  const HomeContent = (
    <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 pb-20">
      <header className="relative bg-gradient-to-r from-primary to-green-600 text-white px-4 pt-6 pb-20 rounded-b-[3rem]">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                   <CircleDollarSign className="h-6 w-6 text-yellow-300"/>
                </div>
                <div>
                    <p className="text-xs">Balance</p>
                    <p className="font-bold text-lg leading-tight">{diamondBalance.toLocaleString()}</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center">
                   <Wallet className="h-6 w-6"/>
                </div>
                <div>
                    <p className="text-xs">Cash</p>
                    <p className="font-bold text-lg leading-tight">₹{inrBalance.toFixed(2)}</p>
                </div>
            </div>
        </div>

        <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32">
            <CircularProgress progress={progress} />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <p className="text-gray-600 dark:text-gray-300 text-xs font-bold">₹{inrBalance.toFixed(2)}</p>
                <p className="text-gray-400 dark:text-gray-500 text-[10px] leading-tight">out of ₹{MINIMUM_PAYOUT_INR}</p>
            </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-md mx-auto space-y-4 px-4 mt-8">
        {!isUserLoading && !user && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg mb-4" role="alert">
                <p className="font-bold">Welcome, Guest!</p>
                <p>Please <button onClick={() => router.push('/signup')} className="underline font-semibold">sign up</button> to save your progress and cash out.</p>
            </div>
        )}
        
        <div className="bg-gradient-to-r from-green-500 to-primary p-4 rounded-xl flex justify-between items-center text-white shadow-lg">
            <div>
                <h3 className="font-bold text-lg">Earn money quickly</h3>
                <p className="text-sm">Up to ₹10,000</p>
            </div>
            <Button variant="secondary" className="bg-white/90 text-primary hover:bg-white">Start</Button>
        </div>

        <div className="space-y-4">
            <h2 className="font-headline text-xl font-semibold text-gray-800 dark:text-gray-200 mt-6">All offers</h2>
            <TaskList tasks={anytimeTasks} onCompleteTask={handleTaskComplete} listId="anytime" />
        </div>
      </main>
      
      <BottomNav />

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
    </div>
  );
  
  if (showSplash) {
    return <SplashScreen />;
  }

  if (isUserLoading) {
     return <SplashScreen />;
  }

  return HomeContent;
}
