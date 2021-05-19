import { createContext, useContext } from 'react';
import { useClients } from 'hooks/index.js';

export const TaskContext = createContext({
  /** @var array */
  tasks: [],

  /** @var array */
  clientTasks: [],
});

const useTasks = (status = null) => {
  const tasksData = useContext(TaskContext);
  const { client } = useClients();
  const clientTasks = tasksData.tasks.filter(t => t.client === client.id);
  const tasksByStatus = status ? clientTasks.filter(t => t.status === status) : [];

  return { ...tasksData, clientTasks, tasksByStatus };
};

export default useTasks;
