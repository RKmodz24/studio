
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { copy } from "@/lib/locales";

type CashoutProgressProps = {
  progress: number;
  inrBalance: number;
  minPayout: number;
  onCashout: () => void;
  isCashingOut: boolean;
};

const CashoutProgress = ({ progress, inrBalance, minPayout, onCashout, isCashingOut }: CashoutProgressProps) => {
  const canCashout = inrBalance >= minPayout;

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">{copy.cashout.title}</CardTitle>
        <CardDescription>{copy.cashout.description(minPayout)}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between items-center">
             <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              ₹{inrBalance.toFixed(2)} / <span className="text-primary font-semibold">₹{minPayout.toFixed(2)}</span>
            </p>
            <Button 
              onClick={onCashout} 
              disabled={!canCashout || isCashingOut}
              className="bg-accent text-accent-foreground hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-md disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:shadow-none disabled:transform-none"
            >
              {isCashingOut ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {copy.cashout.buttonProcessing}
                </>
              ) : copy.cashout.button}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashoutProgress;
