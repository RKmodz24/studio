"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Gem, Crown, Trophy, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Progress } from "@/components/ui/progress";

type CandyCrushGameProps = {
  onReward: (reward: number) => void;
};

const candyIcons = ['🍬', '🍭', '🍫', '🍩', '🍪', '🍮', '🍰', '🧁'];
const gridSize = 8;

const rewardTiers = [
  { time: 60, reward: 50, name: "Quick Treat" },         // 1 min
  { time: 300, reward: 100, name: "Sweet Streak" },       // 5 mins
  { time: 1800, reward: 400, name: "Sugar Rush" },      // 30 mins
  { time: 7200, reward: 1500, name: "Candy Master" },     // 120 mins
  { time: 18000, reward: 2000, name: "Gummy Guru" },    // 300 mins
  { time: 180000, reward: 100000, name: "Diamond Legend" }, // 3000 mins
];

const CandyCrushGame = ({ onReward }: CandyCrushGameProps) => {
  const { toast } = useToast();
  const [grid, setGrid] = useState<string[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [claimedTiers, setClaimedTiers] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  // Generate initial grid
  useEffect(() => {
    setGrid(Array.from({ length: gridSize * gridSize }, () => candyIcons[Math.floor(Math.random() * candyIcons.length)]));
  }, []);
  
  // Game timer
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setTotalPlayTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  // Check for rewards
  useEffect(() => {
    rewardTiers.forEach((tier, index) => {
      if (totalPlayTime >= tier.time && !claimedTiers.includes(index)) {
        onReward(tier.reward);
        setClaimedTiers(prev => [...prev, index]);
        toast({
          title: "Milestone Reached!",
          description: (
            <div className="flex items-center">
              You earned {tier.reward} <Gem className="ml-1 h-4 w-4 text-blue-400" /> for playing {tier.time / 60} minutes!
            </div>
          ),
        });
      }
    });
  }, [totalPlayTime, claimedTiers, onReward, toast]);
  
  const handleCandyClick = (index: number) => {
    if (selected === null) {
      setSelected(index);
    } else {
      // Simplistic swap and match logic
      const newGrid = [...grid];
      [newGrid[selected], newGrid[index]] = [newGrid[index], newGrid[selected]]; // Swap
      
      // Very basic "match" simulation: just randomize some tiles
      for(let i=0; i<5; i++){
        const randomIndex = Math.floor(Math.random() * newGrid.length);
        newGrid[randomIndex] = candyIcons[Math.floor(Math.random() * candyIcons.length)];
      }

      setGrid(newGrid);
      setSelected(null);
    }
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
    <div className="flex flex-col items-center justify-center space-y-4 p-4 bg-blue-50 dark:bg-gray-900 rounded-lg">
      <div className="w-full grid grid-cols-2 gap-4 text-center">
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center"><Clock className="mr-1 h-4 w-4"/>Total Playtime</p>
          <p className="text-2xl font-bold font-mono">{formatTime(totalPlayTime)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center"><Trophy className="mr-1 h-4 w-4"/>Next Reward</p>
          <div className="text-2xl font-bold flex items-center justify-center">
            {nextTier ? (
                <>
                {nextTier.reward} <Gem className="ml-1 h-5 w-5 text-blue-400" />
                </>
            ): (
                <>
                All Clear! <Crown className="ml-1 h-5 w-5 text-yellow-500" />
                </>
            )}
            </div>
        </div>
      </div>
      
      {nextTier && (
          <div className="w-full px-2">
            <Progress value={progressToNextTier} className="h-3" />
            <p className="text-xs text-center mt-1 text-muted-foreground">Next reward at {formatTime(nextTier.time)}</p>
        </div>
      )}


      <div className={cn("grid gap-1 p-2 bg-blue-200 dark:bg-blue-900/30 rounded-lg shadow-inner", `grid-cols-8`)}>
        {grid.map((icon, index) => (
          <div 
            key={index} 
            className={cn(
                "flex items-center justify-center h-8 w-8 rounded-md text-xl cursor-pointer transition-transform duration-200",
                selected === index ? 'bg-yellow-300 scale-110' : 'bg-white/50 dark:bg-gray-800/50'
            )}
            onClick={() => handleCandyClick(index)}
          >
            {icon}
          </div>
        ))}
      </div>

       <Button onClick={() => setIsPaused(!isPaused)} variant={isPaused ? "default" : "outline"} className="w-full">
        {isPaused ? "Resume" : "Pause"}
      </Button>

      <div className="w-full pt-2">
        <h3 className="font-semibold mb-2 text-center">Rewards</h3>
        <div className="space-y-1 max-h-32 overflow-y-auto">
            {rewardTiers.map((tier, index) => (
                <div key={index} className={cn("flex justify-between items-center p-2 rounded-md text-sm", claimedTiers.includes(index) ? "bg-green-100 dark:bg-green-900/50" : "bg-gray-100 dark:bg-gray-800")}>
                    <p>{tier.name} ({tier.time/60} min)</p>
                    <p className="font-bold flex items-center">{tier.reward} <Gem className="ml-1 h-4 w-4 text-blue-500"/></p>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default CandyCrushGame;
