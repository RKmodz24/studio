"use client";

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Gem, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type CandyCrushGameProps = {
  onComplete: (reward: number) => void;
  reward: number;
};

const candyIcons = ['🍬', '🍭', '🍫', '🍩', '🍪', '🍮', '🍰', '🧁'];
const grid_size = 6;

const CandyCrushGame = ({ onComplete, reward }: CandyCrushGameProps) => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(40);
  const [gameState, setGameState] = useState<'playing' | 'ad' | 'finished'>('playing');
  const [gameKey, setGameKey] = useState(0); // Used to reset the game

  const grid = useMemo(() => {
    return Array.from({ length: grid_size * grid_size }, () => candyIcons[Math.floor(Math.random() * candyIcons.length)]);
  }, [gameKey]);
  
  useEffect(() => {
    if (gameState !== 'playing') return;

    if (timeLeft <= 0) {
      setGameState('ad');
      toast({
        title: "Time's up!",
        description: "Watching ad to get your reward...",
        duration: 3000,
      });

      // Simulate ad watching
      setTimeout(() => {
        onComplete(reward);
        setGameState('finished');
      }, 3000);
      
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameState, onComplete, reward, toast]);

  const handlePlayAgain = () => {
    setTimeLeft(40);
    setGameState('playing');
    setGameKey(prev => prev + 1); // Regenerate grid
  };
  
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
        {gameState === 'playing' && (
            <div className="relative">
                <div className="grid grid-cols-6 gap-2 p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg shadow-inner">
                    {grid.map((icon, index) => (
                    <div key={index} className="flex items-center justify-center h-10 w-10 bg-white/50 dark:bg-gray-800/50 rounded-md text-2xl animate-in fade-in zoom-in-50 duration-500">
                        {icon}
                    </div>
                    ))}
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/50 text-white font-bold text-5xl rounded-full h-24 w-24 flex items-center justify-center border-4 border-white">
                    {timeLeft}
                </div>
            </div>
        )}
        {gameState === 'ad' && (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-lg font-medium">Watching Ad...</p>
                <p className="text-sm text-muted-foreground">You will receive your reward shortly.</p>
            </div>
        )}
        {gameState === 'finished' && (
            <div className="flex flex-col items-center justify-center space-y-4 p-8">
                 <Gem className="h-12 w-12 text-blue-400" />
                <p className="text-lg font-medium">You earned {reward} diamonds!</p>
                <Button onClick={handlePlayAgain}>
                    Play Again
                </Button>
            </div>
        )}
    </div>
  );
};

export default CandyCrushGame;
