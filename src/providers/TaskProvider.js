import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth, TaskContext } from 'hooks';
import { cancellablePromise } from 'util/index';

const TaskProvider = ({ children }) => {
  const { post } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched) {
      const cancelFetch = cancellablePromise(function* () {
        const { tasks } = yield post('getTasks');
        setTasks(tasks);
        setFetched(true);
      }, 'taskFetch');

      return () => {
        cancelFetch();
      };
    }
  }, []);

  const addTask = newTask => {
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
  };

  return <TaskContext.Provider value={{ tasks, addTask }}>{children}</TaskContext.Provider>;
};

TaskProvider.propTypes = {
  children: PropTypes.node,
};

export default TaskProvider;
