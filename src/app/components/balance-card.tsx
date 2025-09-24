import { Card, CardContent } from "@/components/ui/card";
import { Gem } from "lucide-react";

type BalanceCardProps = {
  diamondBalance: number;
  inrBalance: number;
  balanceKey: number;
};

const BalanceCard = ({ diamondBalance, inrBalance, balanceKey }: BalanceCardProps) => {
  return (
    <Card className="overflow-hidden shadow-lg">
      <CardContent className="flex justify-around items-center p-6 bg-gradient-to-tr from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Diamonds</p>
          <div key={balanceKey} className="flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <Gem className="h-6 w-6 text-blue-400" />
            <span className="font-headline text-3xl font-bold text-gray-800 dark:text-gray-200">
              {diamondBalance.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="h-16 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Balance</p>
          <div key={balanceKey + 0.5} className="flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <span className="font-headline text-3xl font-bold text-primary">
              ₹{inrBalance.toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceCard;
