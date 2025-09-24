
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Users, Award, Link } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

type ReferralCardProps = {
  referralCode: string;
  referralCount: number;
  commissionEarned: number;
};

const ReferralCard = ({ referralCode, referralCount, commissionEarned }: ReferralCardProps) => {
  const { toast } = useToast();
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin;
      setReferralLink(`${baseUrl}/?ref=${referralCode}`);
    }
  }, [referralCode]);

  const handleCopy = (textToCopy: string, type: 'code' | 'link') => {
    navigator.clipboard.writeText(textToCopy);
    toast({
      title: "Copied!",
      description: `Referral ${type} copied to clipboard.`,
    });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline">Refer & Earn</CardTitle>
        <CardDescription>Invite friends and earn 20% of their earnings!</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Your Referral Code</label>
            <div className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
              <span className="font-mono text-lg font-semibold text-primary">{referralCode}</span>
              <Button variant="ghost" size="icon" onClick={() => handleCopy(referralCode, 'code')}>
                <Copy className="h-5 w-5" />
              </Button>
            </div>
        </div>
         <div className="space-y-2">
            <label htmlFor="referralLink" className="text-sm font-medium text-muted-foreground">Your Referral Link</label>
            <div className="flex items-center space-x-2">
                <Input id="referralLink" value={referralLink} readOnly className="bg-gray-100 dark:bg-gray-800" />
                <Button variant="outline" size="icon" onClick={() => handleCopy(referralLink, 'link')}>
                    <Copy className="h-5 w-5" />
                </Button>
            </div>
        </div>
        <div className="flex justify-around text-center pt-2">
            <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="font-bold text-xl">{referralCount}</p>
                    <p className="text-xs text-muted-foreground">Referrals</p>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-muted-foreground" />
                <div>
                    <p className="font-bold text-xl">₹{commissionEarned.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Commission</p>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;
