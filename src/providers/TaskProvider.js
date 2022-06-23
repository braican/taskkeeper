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

  /**
   * Add a new task.
   *
   * @param {object} newTask The task to add.
   *
   * @return void
   */
  const addTask = newTask => {
    const newTasks = [...tasks, newTask];
    setTasks(newTasks);
  };

  /**
   * Update a task in state.
   *
   * @param {object} newTask Task data.
   *
   * @return void
   */
  const updateTask = newTask => {
    const newTasks = [...tasks].map(task => (task.id === newTask.id ? newTask : task));
    setTasks(newTasks);
  };

  /**
   * Delete a task in state.
   *
   * @param {string} id Task ID.
   *
   * @return void
   */
  const deleteTask = id => {
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex > -1) {
      const newTasks = [...tasks];
      newTasks.splice(taskIndex, 1);
      setTasks(newTasks);
    }
  };

  /**
   * Removes a list of tasks.
   *
   * @param {array} taskIds List of task IDs.
   *
   * @return void
   */
  const removeTasks = taskIds => {
    const newTasks = [...tasks].filter(({ id }) => taskIds.indexOf(id) === -1);
    setTasks(newTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, removeTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

TaskProvider.propTypes = {
  children: PropTypes.node,
};

export default TaskProvider;
