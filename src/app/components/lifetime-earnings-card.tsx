import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

type LifetimeEarningsCardProps = {
  lifetimeEarnings: number;
};

const LifetimeEarningsCard = ({ lifetimeEarnings }: LifetimeEarningsCardProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Lifetime Earnings</CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ₹{lifetimeEarnings.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">
          Total amount you have cashed out
        </p>
      </CardContent>
    </Card>
  );
};

export default LifetimeEarningsCard;
