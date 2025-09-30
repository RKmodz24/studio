
"use client";

import { Gem } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/locales";

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);
  const [animationStep, setAnimationStep] = useState(0);

  useEffect(() => {
    const step1 = setTimeout(() => setAnimationStep(1), 500); // Diamond animation
    const step2 = setTimeout(() => setAnimationStep(2), 1000); // "Welcome to" animation
    const timer = setTimeout(() => setVisible(false), 3000); // Fade out screen
    return () => {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="relative h-20 w-20">
        <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500",
            animationStep >= 1 ? 'opacity-100' : 'opacity-0'
        )}>
            <div className={cn(animationStep >= 1 ? "animate-coin-flip" : "")}>
              <Gem className="h-16 w-16 text-primary animate-pulse" />
            </div>
        </div>
      </div>

      <div className={cn(
          "mt-8 text-center transition-opacity duration-1000 animate-fadeInUp",
          animationStep >= 2 ? "opacity-100" : "opacity-0"
      )}>
        <p className="text-xl text-muted-foreground">{copy.splash.welcome}</p>
        <h1 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-gray-200">
          {copy.splash.title}
        </h1>
      </div>
      
      <style jsx>{`
        @keyframes coin-flip {
          0% {
            transform: translateY(20px) rotateY(0deg) scale(0.5);
            opacity: 0;
          }
          100% {
            transform: translateY(0) rotateY(1080deg) scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-coin-flip { animation: coin-flip 1.5s cubic-bezier(0.34, 0, 0.64, 1) forwards; }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out forwards;
        }
        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
            animation-delay: 1.5s;
        }
        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
                filter: brightness(1);
            }
            50% {
                transform: scale(1.1);
                filter: brightness(1.2);
            }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;

