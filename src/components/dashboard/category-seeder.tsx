'use client';
import { useEffect } from 'react';
import { useFirestore } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import { categories } from '@/lib/data';

type CategorySeederProps = {
  categories: Category[];
};

export function CategorySeeder({ categories }: CategorySeederProps) {
  const firestore = useFirestore();

  useEffect(() => {
    // Only seed if there are no categories in the database
    if (categories.length === 0 && firestore) {
      const seedCategories = async () => {
        try {
          const batch = writeBatch(firestore);
          const categoriesColRef = collection(firestore, 'categories');

          categories.forEach((category) => {
            const docRef = doc(categoriesColRef, category.id);
            batch.set(docRef, category);
          });

          await batch.commit();
          console.log('Default categories have been seeded.');
        } catch (error) {
          console.error("Error seeding categories: ", error);
        }
      };

      seedCategories();
    }
  }, [categories, firestore]);

  // This component doesn't render anything visible
  return null;
}
