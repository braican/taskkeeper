// contexts/CategoryContext.tsx
'use client';

import { RecordModel } from 'pocketbase';
import pb from '@/lib/pocketbase';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Category } from '@/types';

interface CategoryContextType {
  areCategoriesLoaded: boolean;
  categories: Category[];
  getOrCreateCategory: (name: string) => Promise<Category | null>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(
  undefined,
);

const recordToCategory = (record: RecordModel): Category => ({
  id: record.id,
  name: record.name,
});

export const CategoryProvider = ({ children }: { children: ReactNode }) => {
  const [areCategoriesLoaded, setCategoriesLoaded] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);
  const [prevUser, setPrevUser] = useState(user);

  if (prevUser !== user) {
    setPrevUser(user);
    if (!user) {
      setCategories([]);
      setCategoriesLoaded(false);
    }
  }

  useEffect(() => {
    if (!user) {
      hasFetchedRef.current = false;
      return;
    }
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    async function fetchCategories() {
      try {
        const records = await pb.collection('categories').getFullList();
        setCategoriesLoaded(true);
        setCategories(records.map(recordToCategory));
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    fetchCategories();
  }, [user]);

  const getOrCreateCategory = async (
    name: string,
  ): Promise<Category | null> => {
    const trimmed = name.trim();
    if (!trimmed) {
      return null;
    }

    const existing = categories.find(
      (category) => category.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (existing) {
      return existing;
    }

    const record = await pb
      .collection('categories')
      .create({ name: trimmed, user: user?.id });
    const category = recordToCategory(record);
    setCategories((oldCategories) => [...oldCategories, category]);
    return category;
  };

  return (
    <CategoryContext.Provider
      value={{ areCategoriesLoaded, categories, getOrCreateCategory }}
    >
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategories = () => {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
};
