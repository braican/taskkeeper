import React from 'react';
import { useTasks } from 'hooks';
import Task from 'components/elements/Task';

import styles from './TaskList.module.scss';

const TaskList = () => {
  const { clientTasks } = useTasks();

  return (
    <ul className={styles.tasklist}>
      {clientTasks.map(task => (
        <li className={styles.task} key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
