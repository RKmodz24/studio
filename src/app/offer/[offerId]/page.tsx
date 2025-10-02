'use client';

import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  CircleDollarSign,
  X,
  AlertCircle,
  CheckCircle,
  Download,
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { copy } from '@/lib/locales';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

const offers: { [key: string]: any } = {
  'install-jar-app': {
    id: 'install-jar-app',
    title: 'Install Rapido & Ride',
    totalInr: 29.16,
    totalDiamonds: 2916,
    appIcon: '/app-icon.png', // Placeholder for Rapido
    link: 'https://m.rapido.cc/Ewte/n538dyfh',
    steps: [
      { name: 'Install App', reward: 200, completed: false },
      { name: 'Register an account', reward: 500, completed: false },
      { name: 'Complete a ride', reward: 1500, completed: false },
      { name: 'Day 2 - Open the app', reward: 716, completed: false },
    ],
    disclaimer:
      'To earn rewards, please make sure that the user is new and has not turned on VPN.',
  },
};

export default function OfferPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const offerId = params.offerId as string;
  const offer = offers[offerId];

  const [offerSteps, setOfferSteps] = useState(offer?.steps || []);
  const [claimed, setClaimed] = useState(false);

  if (!offer) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
        <p>Offer not found.</p>
        <Button onClick={() => router.push('/')} className="mt-4">
          Go Home
        </Button>
      </main>
    );
  }

  const handleClaimOffer = () => {
    toast({
      title: 'Redirecting to offer...',
      description: 'You will be redirected to complete the offer.',
    });
    if (offer.link) {
      window.open(offer.link, '_blank');
    }
    setClaimed(true);
  };

  const completedSteps = offerSteps.filter(step => step.completed).length;
  const progress = (completedSteps / offerSteps.length) * 100;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 flex items-center justify-between bg-white p-4 shadow-sm dark:bg-gray-800">
        <div className="flex items-center space-x-2">
          <CircleDollarSign className="h-7 w-7 text-yellow-500" />
          <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
            {offer.totalDiamonds.toLocaleString()} ≈ ₹
            {offer.totalInr.toFixed(2)}
          </span>
        </div>
        <Button variant="ghost" size="icon" onClick={() => router.push('/')}>
          <X className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 p-4">
        <div className="w-full max-w-md mx-auto space-y-4">
          <Card>
            <CardContent className="flex items-center space-x-4 p-4">
              <Image
                src={offer.appIcon}
                alt={offer.title}
                width={64}
                height={64}
                className="rounded-lg"
                data-ai-hint="app icon"
              />
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{offer.title}</h2>
                <div className="flex items-center text-sm">
                  <p className="mr-2 text-gray-600 dark:text-gray-400">
                    {copy.offerPage.offerStatus}:
                  </p>
                  <span
                    className={`font-semibold ${
                      claimed
                        ? 'text-yellow-600'
                        : 'text-red-500'
                    }`}
                  >
                    {claimed ? copy.offerPage.pending : copy.offerPage.unclaimed}
                  </span>
                  <AlertCircle className="ml-1 h-4 w-4 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold">{copy.offerPage.stepsToComplete}</h3>
            </CardHeader>
            <CardContent className="space-y-2">
              <Progress value={progress} className="h-2" />
              {offerSteps.map((step, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg bg-gray-100 p-3 dark:bg-gray-800"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full ${
                        step.completed
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <span className="text-xs font-bold text-gray-700">
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <p
                      className={`font-medium ${
                        step.completed ? 'text-gray-400 line-through' : ''
                      }`}
                    >
                      {step.name}
                    </p>
                  </div>
                  <div className="flex items-center font-semibold text-yellow-500">
                    <CircleDollarSign className="mr-1 h-4 w-4" />
                    <span>{step.reward.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="text-center text-sm text-red-500">
            <p>{offer.disclaimer}</p>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 bg-white p-4 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] dark:bg-gray-800">
        <Button
          className="w-full h-12 text-lg font-bold"
          onClick={handleClaimOffer}
          disabled={claimed}
        >
          {claimed ? (
            'Offer Claimed'
          ) : (
            <>
              <Download className="mr-2" />
              {copy.offerPage.earn} ₹{offer.totalInr.toFixed(2)}
            </>
          )}
        </Button>
      </footer>
    </div>
  );
}
