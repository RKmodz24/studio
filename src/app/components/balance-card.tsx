
import { Card, CardContent } from "@/components/ui/card";
import { CircleDollarSign } from "lucide-react";
import { copy } from "@/lib/locales";

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
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{copy.balance.diamonds}</p>
          <div key={balanceKey} className="flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-500">
            <CircleDollarSign className="h-6 w-6 text-yellow-500" />
            <span className="font-headline text-3xl font-bold text-gray-800 dark:text-gray-200">
              {diamondBalance.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="h-16 w-px bg-gray-200 dark:bg-gray-700" />
        <div className="text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{copy.balance.balance}</p>
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
