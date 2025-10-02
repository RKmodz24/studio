export type Task = {
  id: string;
  title: string;
  reward: number;
  completed: boolean; // Note: completed is being deprecated in favor of status
  status: 'incomplete' | 'processing' | 'completed';
  type: 'basic' | 'ad' | 'game' | 'offer' | 'withdraw';
  offerId?: string;
  description?: string;
  icon?: string;
};

export type BankPayoutDetails = {
  payoutType: 'bank';
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
};

export type UpiPayoutDetails = {
  payoutType: 'upi';
  upiId: string;
};

export type PayPalPayoutDetails = {
  payoutType: 'paypal';
  paypalEmail: string;
};

export type PayoutDetails = BankPayoutDetails | UpiPayoutDetails | PayPalPayoutDetails;
