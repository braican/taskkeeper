import React from 'react';
import PropTypes from 'prop-types';
import { useTasks } from 'hooks';
import Task from 'components/elements/Task';

import { TASK_STATUS } from 'constants.js';

import styles from './TaskList.module.scss';

const TaskList = ({ status, headline = '' }) => {
  const { clientTasks } = useTasks();
  const tasksByStatus = clientTasks.filter(t => t.status === status);

  if (tasksByStatus.length < 1) {
    return <div className={styles.taskWrap}>No {headline.toLowerCase()} tasks</div>;
  }

  return (
    <div className={styles.taskWrap}>
      {headline && <h3 className={styles.headline}>{headline}</h3>}
      <ul className={styles.tasklist}>
        {tasksByStatus.map(task => (
          <li className={styles.task} key={task.id}>
            <Task task={task} />
          </li>
        ))}
      </ul>
    </div>
  );
};

TaskList.propTypes = {
  status: PropTypes.oneOf([TASK_STATUS.estimated, TASK_STATUS.todo, TASK_STATUS.completed])
    .isRequired,
  headline: PropTypes.string,
};

export default TaskList;
