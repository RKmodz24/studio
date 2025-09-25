
"use client";

import { Gem } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/locales";

const TreasureChestIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-20 w-20 text-yellow-600"
  >
    <path d="M20 12H4" />
    <path d="M6 12L4 17H20L18 12" />
    <path d="M12 7V12" />
    <path d="M4 12V7C4 5.34315 5.34315 4 7 4H17C18.6569 4 20 5.34315 20 7V12" />
  </svg>
);

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);
  const [animationStep, setAnimationStep] = useState(0); // 0: initial, 1: opening, 2: revealed

  useEffect(() => {
    const step1 = setTimeout(() => setAnimationStep(1), 500); // Start opening
    const step2 = setTimeout(() => setAnimationStep(2), 1500); // Diamond revealed
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
        {/* Chest Base */}
        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 h-[60%] transition-all duration-500",
            animationStep > 0 ? "animate-chest-base-down" : ""
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 48"
            className="w-full h-full"
            fill="rgb(161 98 7)"
          >
            <path d="M0 0 H80 V48 H0 Z" />
            <rect x="0" y="10" width="80" height="8" fill="rgb(202 138 4)" />
            <rect x="36" y="22" width="8" height="8" fill="rgb(202 138 4)" />
          </svg>
        </div>
        {/* Chest Lid */}
        <div
          className={cn(
            "absolute top-0 left-0 right-0 h-[50%] origin-bottom transition-transform duration-1000",
            animationStep > 0 ? "animate-chest-lid-open" : ""
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 80 40"
            className="w-full h-full"
            fill="rgb(161 98 7)"
          >
            <path d="M0 40 Q 40 -10, 80 40 Z" />
            <rect x="0" y="20" width="80" height="8" fill="rgb(202 138 4)" />
          </svg>
        </div>
        {/* Diamond */}
        <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500",
            animationStep === 2 ? 'opacity-100 animate-diamond-reveal' : 'opacity-0'
        )}>
            <Gem className="h-10 w-10 text-primary animate-pulse" />
        </div>
      </div>

      <h1 className="mt-8 text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 animate-fadeInUp">
        {copy.splash.title}
      </h1>
      <style jsx>{`
        @keyframes chest-lid-open {
          0% { transform: rotateX(0deg); }
          100% { transform: rotateX(-110deg); }
        }
        @keyframes chest-base-down {
          0% { transform: translateY(0); }
          50% { transform: translateY(5px); }
          100% { transform: translateY(0); }
        }
        @keyframes diamond-reveal {
          0% { transform: translateY(10px) scale(0.8); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-chest-lid-open { animation: chest-lid-open 1s ease-in-out forwards; }
        .animate-chest-base-down { animation: chest-base-down 0.5s ease-in-out forwards; }
        .animate-diamond-reveal { animation: diamond-reveal 0.5s ease-out forwards; }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out 1.8s forwards;
          opacity: 0; 
        }
        .animate-pulse {
            animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
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
