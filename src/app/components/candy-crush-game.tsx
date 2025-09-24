"use client";

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Gem, Crown, Trophy, Clock, Star } from 'lucide-react';
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
  const [score, setScore] = useState(0);
  const [totalPlayTime, setTotalPlayTime] = useState(0);
  const [claimedTiers, setClaimedTiers] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);

  const createGrid = () => Array.from({ length: gridSize * gridSize }, () => candyIcons[Math.floor(Math.random() * candyIcons.length)]);

  useEffect(() => {
    setGrid(createGrid());
  }, []);
  
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setTotalPlayTime(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

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
      const isAdjacent = 
        Math.abs(selected - index) === 1 || // Horizontal
        Math.abs(selected - index) === gridSize; // Vertical
      
      if (!isAdjacent) {
        setSelected(index); // It's not adjacent, just select the new one
        return;
      }
      
      // Swap candies
      const newGrid = [...grid];
      [newGrid[selected], newGrid[index]] = [newGrid[index], newGrid[selected]];

      // Simulate a successful match ~50% of the time
      if (Math.random() > 0.5) {
        setScore(prev => prev + 10);
        // Replace "matched" candies with new random ones
        newGrid[selected] = candyIcons[Math.floor(Math.random() * candyIcons.length)];
        newGrid[index] = candyIcons[Math.floor(Math.random() * candyIcons.length)];
        setGrid(newGrid);
      } else {
        // No match, swap them back visually after a short delay
        setGrid(newGrid);
        setTimeout(() => {
            setGrid(prevGrid => {
                const revertGrid = [...prevGrid];
                [revertGrid[selected], revertGrid[index]] = [revertGrid[index], revertGrid[selected]];
                return revertGrid;
            });
        }, 300);
      }
      
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
      <div className="w-full grid grid-cols-3 gap-2 text-center text-xs">
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
          <p className="font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center"><Clock className="mr-1 h-3 w-3"/>Time</p>
          <p className="text-xl font-bold font-mono">{formatTime(totalPlayTime)}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
          <p className="font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center"><Star className="mr-1 h-3 w-3"/>Score</p>
          <p className="text-xl font-bold font-mono">{score}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow">
          <p className="font-medium text-gray-500 dark:text-gray-400 flex items-center justify-center"><Trophy className="mr-1 h-3 w-3"/>Next Tier</p>
          <div className="text-xl font-bold flex items-center justify-center">
            {nextTier ? (
                <>
                {nextTier.reward} <Gem className="ml-1 h-4 w-4 text-blue-400" />
                </>
            ): (
                <Crown className="h-5 w-5 text-yellow-500" />
            )}
            </div>
        </div>
      </div>
      
      {nextTier && (
          <div className="w-full px-2">
            <Progress value={progressToNextTier} className="h-2" />
            <p className="text-xs text-center mt-1 text-muted-foreground">Next reward at {formatTime(nextTier.time)}</p>
        </div>
      )}

      <div className={cn("grid gap-1 p-2 bg-blue-200 dark:bg-blue-900/30 rounded-lg shadow-inner", `grid-cols-${gridSize}`)}>
        {grid.map((icon, index) => (
          <div 
            key={index} 
            className={cn(
                "flex items-center justify-center h-8 w-8 rounded-md text-xl cursor-pointer transition-transform duration-200",
                selected === index ? 'bg-yellow-300 scale-110 shadow-lg' : 'bg-white/50 dark:bg-gray-800/50',
                "hover:scale-110 hover:bg-white/80"
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
