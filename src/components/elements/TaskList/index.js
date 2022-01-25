import React from 'react';
import PropTypes from 'prop-types';
import Task from 'components/elements/Task';

import styles from './TaskList.module.scss';

const TaskList = ({ tasks }) => (
  <div className={styles.taskWrap}>
    <ul className={styles.tasklist}>
      {tasks.map(task => (
        <li className={styles.task} key={task.id}>
          <Task task={task} />
        </li>
      ))}
    </ul>
  </div>
);

TaskList.propTypes = {
  tasks: PropTypes.array,
};

export default TaskList;
