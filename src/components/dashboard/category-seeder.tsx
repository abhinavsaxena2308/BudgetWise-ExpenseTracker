'use client';
import { useEffect } from 'react';
import { useFirestore, useUser } from '@/firebase';
import { collection, writeBatch, doc } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import { categories } from '@/lib/data';

type CategorySeederProps = {
  categories: Category[];
};

export function CategorySeeder({ categories }: CategorySeederProps) {
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    // Only seed if the user is loaded and has no categories
    if (user && categories.length === 0 && firestore) {
      const seedCategories = async () => {
        try {
          const batch = writeBatch(firestore);
          // Categories are now in a sub-collection under the user
          const categoriesColRef = collection(
            firestore,
            'users',
            user.uid,
            'categories'
          );

          categories.forEach((category) => {
            const docRef = doc(categoriesColRef, category.id);
            batch.set(docRef, category);
          });

          await batch.commit();
          console.log('Default categories have been seeded for the user.');
        } catch (error) {
          console.error('Error seeding categories: ', error);
        }
      };

      seedCategories();
    }
  }, [categories, firestore, user]);

  // This component doesn't render anything visible
  return null;
}
