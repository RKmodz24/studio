export type Task = {
  id: string;
  title: string;
  reward: number;
  completed: boolean;
  type: 'basic' | 'ad';
};
