"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Gem, Crown, Trophy, Clock, Star, PlayCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


type AdPlayerProps = {
  onReward: (reward: number) => void;
};

const rewardTiers = [
  { time: 60, reward: 50, ads: 10, name: "Quick Start" },     // 1 min
  { time: 300, reward: 100, ads: 20, name: "Ad Marathoner" },  // 5 mins
  { time: 1800, reward: 400, ads: 30, name: "Super Streamer" },// 30 mins
  { time: 7200, reward: 1500, name: "Video Virtuoso" }, // 120 mins
  { time: 18000, reward: 2000, name: "Ad Admiral" },     // 300 mins
  { time: 180000, reward: 100000, name: "Diamond Legend" }, // 3000 mins
];

const AdPlayerGame = ({ onReward }: AdPlayerProps) => {
  const { toast } = useToast();
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [claimedTiers, setClaimedTiers] = useState<number[]>([]);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
        if (!isWatchingAd) {
            setTotalPlayTime(prev => prev + 1);
        }
    }, 1000);
    return () => clearInterval(timer);
  }, [isWatchingAd]);

  useEffect(() => {
    rewardTiers.forEach((tier, index) => {
      if (totalPlayTime >= tier.time && !claimedTiers.includes(index)) {
        onReward(tier.reward);
        setClaimedTiers(prev => [...prev, index]);
        toast({
          title: "Milestone Reached!",
          description: (
            <div className="flex items-center">
              You earned {tier.reward} <Gem className="ml-1 h-4 w-4 text-blue-400" /> for watching ads for {tier.time / 60} minutes!
            </div>
          ),
        });
      }
    });
  }, [totalPlayTime, claimedTiers, onReward, toast]);

  const handleWatchAd = () => {
    setIsWatchingAd(true);
    toast({
        title: "Ad playing...",
        description: "You will be rewarded after the ad."
    });

    setTimeout(() => {
        setIsWatchingAd(false);
        setAdsWatched(prev => prev + 1);
        const adReward = 5; // Small reward for each ad
        onReward(adReward);
         toast({
          title: "Ad Finished!",
          description: `You earned ${adReward} diamonds.`,
        });
    }, 5000); // 5 second ad simulation
  };
  

  const nextTier = useMemo(() => {
    return rewardTiers.find((_, index) => !claimedTiers.includes(index));
  }, [claimedTiers]);

  const progressToNextTier = useMemo(() => {
    if (!nextTier) return 100;
    const previousTierTime = rewardTiers[claimedTiers.length -1]?.time || 0;
    const totalTimeForTier = nextTier.time - previousTierTime;
    const timeInCurrentTier = totalPlayTime - previousTierTime;
    return (timeInCurrentTier / totalTimeForTier) * 100;
  }, [totalPlayTime, nextTier, claimedTiers]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
        <Alert>
            <PlayCircle className="h-4 w-4" />
            <AlertTitle>Watch Ads, Earn Diamonds!</AlertTitle>
            <AlertDescription>
                Your timer runs continuously. Watch ads to earn bonus diamonds and work towards big time-based rewards.
            </AlertDescription>
        </Alert>

      <div className="w-full grid grid-cols-2 gap-4 text-center">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
          <p className="font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center"><Clock className="mr-1 h-4 w-4"/>Total Time</p>
          <p className="text-2xl font-bold font-mono">{formatTime(totalPlayTime)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
          <p className="font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center"><Star className="mr-1 h-4 w-4"/>Ads Watched</p>
          <p className="text-2xl font-bold font-mono">{adsWatched}</p>
        </div>
      </div>
      
      {nextTier && (
          <div className="w-full px-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Next reward: {nextTier.reward} <Gem className="inline-block h-3 w-3 text-blue-400" /></span>
                <span>at {formatTime(nextTier.time)}</span>
            </div>
            <Progress value={progressToNextTier} className="h-3" />
        </div>
      )}

      <Button onClick={handleWatchAd} disabled={isWatchingAd} className="w-full py-6 text-lg">
        {isWatchingAd ? (
            <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Watching Ad...
            </>
        ) : (
            <>
                <PlayCircle className="mr-2 h-5 w-5" />
                Watch Ad (+5 <Gem className="inline-block h-4 w-4" />)
            </>
        )}
      </Button>

      <div className="w-full pt-2">
        <h3 className="font-semibold mb-2 text-center">Time Rewards</h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
            {rewardTiers.map((tier, index) => (
                <div key={index} className={cn("flex justify-between items-center p-2 rounded-md text-sm", claimedTiers.includes(index) ? "bg-green-100 dark:bg-green-900/50" : "bg-gray-100 dark:bg-gray-800")}>
                    <p>{tier.name} ({tier.time/60} min)</p>
                    <p className="font-bold flex items-center">{tier.reward.toLocaleString()} <Gem className="ml-1 h-4 w-4 text-blue-500"/></p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdPlayerGame;
