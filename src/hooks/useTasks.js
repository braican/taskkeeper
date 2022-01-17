import { createContext, useContext } from 'react';
import { useClients } from 'hooks/index.js';

export const TaskContext = createContext({
  /** @var array */
  tasks: [],

  /** @var array */
  clientTasks: [],

  /** @var function */
  updateTask: () => {},
});

const useTasks = () => {
  const tasksData = useContext(TaskContext);
  const { client } = useClients();
  const clientTasks = client ? tasksData.tasks.filter(t => t.client === client.id) : [];

  return { ...tasksData, clientTasks };
};

export default useTasks;
