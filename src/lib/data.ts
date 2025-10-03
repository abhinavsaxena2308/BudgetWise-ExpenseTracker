import type { Category } from './types';

export const categories: (Omit<Category, 'id'> & { id: string })[] = [
  { id: 'cat-1', name: 'Food', color: 'hsl(var(--chart-1))' },
  { id: 'cat-2', name: 'Transport', color: 'hsl(var(--chart-2))' },
  { id: 'cat-3', name: 'Housing', color: 'hsl(var(--chart-3))' },
  { id: 'cat-4', name: 'Health', color: 'hsl(var(--chart-4))' },
  { id: 'cat-5', name: 'Entertainment', color: 'hsl(var(--chart-5))' },
  { id: 'cat-6', name: 'Apparel', color: 'hsl(var(--chart-1))' },
];
