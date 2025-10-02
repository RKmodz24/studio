
"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BadgePercent, Users, ShoppingBag, Gift } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Offer", icon: BadgePercent },
  { href: "/my-offers", label: "My offers", icon: Gift },
  { href: "/refer", label: "Refer", icon: Users },
  { href: "/shop", label: "Shop", icon: ShoppingBag },
];

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around items-center w-full max-w-md mx-auto rounded-t-2xl">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link href={item.href} key={item.label}>
            <div
              className={cn(
                "flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 space-y-1 transition-colors",
                isActive ? "text-primary dark:text-primary" : "hover:text-primary"
              )}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
