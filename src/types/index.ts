export interface Member {
  id: string;
  name: string;
  color: string;
}

export type Category = 'food' | 'transport' | 'stay' | 'activities' | 'shopping' | 'other';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  paidBy: string; // member id
  description?: string;
  date: string; // ISO date string
  category: Category;
  members: string[]; // member ids involved
  createdAt: string;
}

export interface Trip {
  id: string;
  name: string;
  emoji: string;
  members: Member[];
  expenses: Expense[];
  createdAt: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export interface MemberBalance {
  memberId: string;
  paid: number;
  owes: number;
  net: number;
}
