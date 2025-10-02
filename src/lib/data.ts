import type { Transaction, Category, Budget } from './types';

export const categories: Category[] = [
  { id: 'cat-1', name: 'Food', color: 'hsl(var(--chart-1))' },
  { id: 'cat-2', name: 'Transport', color: 'hsl(var(--chart-2))' },
  { id: 'cat-3', name: 'Housing', color: 'hsl(var(--chart-3))' },
  { id: 'cat-4', name: 'Health', color: 'hsl(var(--chart-4))' },
  { id: 'cat-5', name: 'Entertainment', color: 'hsl(var(--chart-5))' },
  { id: 'cat-6', name: 'Apparel', color: 'hsl(var(--chart-1))' },
];

export const getCategories = () => categories;

const getDay = (day: number) => {
  const date = new Date();
  date.setDate(day);
  return date;
};

const transactions: Transaction[] = [
  { id: 'txn-1', date: getDay(1), description: 'Grocery shopping', amount: 75.6, categoryId: 'cat-1' },
  { id: 'txn-2', date: getDay(1), description: 'Gasoline', amount: 40.0, categoryId: 'cat-2' },
  { id: 'txn-3', date: getDay(2), description: 'Dinner with friends', amount: 120.0, categoryId: 'cat-1' },
  { id: 'txn-4', date: getDay(3), description: 'Movie tickets', amount: 30.0, categoryId: 'cat-5' },
  { id: 'txn-5', date: getDay(4), description: 'Monthly rent', amount: 1200.0, categoryId: 'cat-3' },
  { id: 'txn-6', date: getDay(5), description: 'Pharmacy', amount: 25.0, categoryId: 'cat-4' },
  { id: 'txn-7', date: getDay(6), description: 'New shirt', amount: 45.0, categoryId: 'cat-6' },
  { id: 'txn-8', date: getDay(7), description: 'Lunch at work', amount: 15.0, categoryId: 'cat-1' },
  { id: 'txn-9', date: getDay(8), description: 'Bus fare', amount: 5.5, categoryId: 'cat-2' },
  { id: 'txn-10', date: getDay(10), description: 'Concert', amount: 85.0, categoryId: 'cat-5' },
];

export const getTransactions = () => transactions;

const budgets: Budget[] = [
  { id: 'bud-1', categoryId: 'cat-1', amount: 500 },
  { id: 'bud-2', categoryId: 'cat-2', amount: 150 },
  { id: 'bud-3', categoryId: 'cat-3', amount: 1200 },
  { id: 'bud-4', categoryId: 'cat-4', amount: 100 },
  { id: 'bud-5', categoryId: 'cat-5', amount: 200 },
  { id: 'bud-6', categoryId: 'cat-6', amount: 150 },
];

export const getBudgets = () => budgets;

export const getSpendingData = () => {
    const data = [];
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = getDay(day);
        const dailySpending = transactions
            .filter(t => t.date.getDate() === day)
            .reduce((sum, t) => sum + t.amount, 0);
        data.push({
            date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            spending: dailySpending > 0 ? dailySpending : null,
        });
    }
    return data.slice(0, new Date().getDate());
};

export const getCategorySpending = () => {
    const categorySpending = categories.map(category => {
        const total = transactions
            .filter(t => t.categoryId === category.id)
            .reduce((sum, t) => sum + t.amount, 0);
        return {
            name: category.name,
            value: total,
            fill: category.color,
        };
    }).filter(c => c.value > 0);

    return categorySpending;
}

