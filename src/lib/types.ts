export type Task = {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
  type: 'basic' | 'ad';
};

export type PayoutDetails = {
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
};
