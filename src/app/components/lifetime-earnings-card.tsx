
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { copy } from "@/lib/locales";

type LifetimeEarningsCardProps = {
  lifetimeEarnings: number;
};

const LifetimeEarningsCard = ({ lifetimeEarnings }: LifetimeEarningsCardProps) => {
  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{copy.lifetimeEarnings.title}</CardTitle>
        <Trophy className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          ₹{lifetimeEarnings.toFixed(2)}
        </div>
        <p className="text-xs text-muted-foreground">
          {copy.lifetimeEarnings.description}
        </p>
      </CardContent>
    </Card>
  );
};

export default LifetimeEarningsCard;
