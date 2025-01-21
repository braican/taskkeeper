// contexts/NewInvoiceContext.tsx
'use client';

import { createContext, ReactNode, useContext, useState } from 'react';
import { Task } from '@/types';

interface NewInvoiceContextType {
  isInvoicing: boolean;
  setIsInvoicing: (newIsInvoicing: boolean) => void;
  tasks: Task[];
  addTask: (task: Task) => void;
  removeTask: (taskId: string) => void;
  clearTasks: () => void;
  getCost: () => number;
}

const NewInvoiceContext = createContext<NewInvoiceContextType | undefined>(
  undefined,
);

export const NewInvoiceProvider = ({
  children,
  rate = 0,
}: {
  children: ReactNode;
  rate?: number;
}) => {
  const [isInvoicing, setIsInvoicing] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const addTask = (task: Task) => {
    setTasks((oldTasks) => [...oldTasks, task]);
  };

  const removeTask = (taskId: string) => {
    setTasks((oldTasks) => oldTasks.filter((task) => task.id !== taskId));
  };

  const getCost = () => {
    return tasks.reduce((prev, curr) => {
      if (curr.hours && curr.hours > 0) {
        return prev + curr.hours * rate;
      }

      const price = Number(curr.price);
      if (price && !isNaN(price)) {
        return prev + price;
      }

      return prev;
    }, 0);
  };

  const clearTasks = () => {
    setTasks([]);
  };

  return (
    <NewInvoiceContext.Provider
      value={{
        isInvoicing,
        setIsInvoicing,
        tasks,
        addTask,
        removeTask,
        clearTasks,
        getCost,
      }}
    >
      {children}
    </NewInvoiceContext.Provider>
  );
};

export const useNewInvoice = () => {
  const context = useContext(NewInvoiceContext);
  if (!context) {
    throw new Error('useNewInvoice must be used within a NewInvoiceProvider');
  }
  return context;
};
