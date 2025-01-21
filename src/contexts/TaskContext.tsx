// contexts/TaskContext.tsx
'use client';

import { RecordModel } from 'pocketbase';
import pb from '@/lib/pocketbase';
import {
  Dispatch,
  SetStateAction,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Task } from '@/types';

interface TaskContextType {
  areTasksLoaded: boolean;
  tasks: Task[];
  setTasks: Dispatch<SetStateAction<Task[]>>;
  addTask: (taskData: Omit<Task, 'id'>) => Promise<void>;
  updateTask: (taskData: Task) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  getClientTasks: (clientId: string) => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const recordToTask = (record: RecordModel): Task => ({
  id: record.id,
  client: record.client,
  description: record.description,
  status: record.status,
  hours: record.hours,
  price: record.price,
});

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [areTasksLoaded, setTasksLoaded] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);

  // Fetch tasks on component mount
  useEffect(() => {
    if (!user) {
      hasFetchedRef.current = false;
      setTasks([]);
      setTasksLoaded(false);
    }

    if (hasFetchedRef.current || !user) return;
    hasFetchedRef.current = true;

    async function fetchTasks() {
      console.log('!! Fetch tasks');

      try {
        const records = await pb.collection('tasks').getFullList();
        const tasks = records.map(recordToTask);
        setTasksLoaded(true);
        setTasks(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    }

    fetchTasks();
  }, [user]);

  const addTask = async (taskData: Omit<Task, 'id'>) => {
    try {
      const record = await pb
        .collection('tasks')
        .create({ ...taskData, user: user?.id });

      setTasks((oldTasks) => [...oldTasks, recordToTask(record)]);
    } catch (error) {
      console.error('Error adding task:', error);
      throw error;
    }
  };

  const updateTask = async (taskData: Task) => {
    if (!taskData.id) {
      return;
    }

    try {
      await pb.collection('tasks').update(taskData.id, taskData);
      setTasks((oldTasks) =>
        oldTasks.map((task) => {
          if (task.id !== taskData.id) {
            return task;
          }
          return { ...task, ...taskData };
        }),
      );
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await pb.collection('tasks').delete(taskId);
      setTasks((oldTasks) => oldTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  };

  const getClientTasks = (clientId: string): Task[] => {
    return tasks.filter((task) => task.client === clientId);
  };

  return (
    <TaskContext.Provider
      value={{
        areTasksLoaded,
        tasks,
        setTasks,
        addTask,
        updateTask,
        deleteTask,
        getClientTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }

  return context;
};
