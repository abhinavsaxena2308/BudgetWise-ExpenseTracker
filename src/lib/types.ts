import type { LucideIcon } from 'lucide-react';
import { Timestamp } from 'firebase/firestore';

export type Transaction = {
  id: string;
  date: Date;
  description: string;
  amount: number;
  categoryId: string;
};

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Budget = {
  id: string;
  name: string;
  amount: number;
  startDate: Timestamp | Date;
  endDate: Timestamp | Date;
  userId?: string;
};
