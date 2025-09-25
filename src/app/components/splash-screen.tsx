
"use client";

import { Gem } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { copy } from "@/lib/locales";

const SplashScreen = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 2500); // Animation duration + delay
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-background transition-opacity duration-500",
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <div className="animate-fadeInScale">
        <Gem className="h-20 w-20 text-primary animate-pulse" />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-800 dark:text-gray-200 animate-fadeInUp">
        {copy.splash.title}
      </h1>
      <style jsx>{`
        @keyframes fadeInScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInScale {
          animation: fadeInScale 1.5s ease-out forwards;
        }
        .animate-fadeInUp {
          animation: fadeInUp 1s ease-out 0.5s forwards;
          opacity: 0; // Start hidden
        }
        .animate-pulse {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
            0%, 100% {
                opacity: 1;
            }
            50% {
                opacity: .7;
            }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
