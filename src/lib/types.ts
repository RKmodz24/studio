export type Task = {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
  type: 'basic' | 'ad' | 'game';
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

export type PayoutDetails = BankPayoutDetails | UpiPayoutDetails;
