import React from 'react';
import PropTypes from 'prop-types';
import Task from 'components/elements/Task';

import styles from './TaskList.module.scss';

const TaskList = ({ tasks, selectable = false }) => (
  <div className={styles.taskWrap}>
    <ul className={styles.tasklist}>
      {tasks.map(task => (
        <li className={styles.task} key={task.id}>
          <Task task={task} selectable={selectable} />
        </li>
      ))}
    </ul>
  </div>
);

TaskList.propTypes = {
  tasks: PropTypes.array,
  selectable: PropTypes.bool,
};

export default TaskList;
