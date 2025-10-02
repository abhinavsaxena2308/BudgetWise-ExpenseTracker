import type { LucideIcon } from 'lucide-react';

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
  categoryId: string;
  amount: number;
};
