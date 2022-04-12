import React from 'react';
import PropTypes from 'prop-types';
import Task from 'components/elements/Task';

import styles from './TaskList.module.scss';

const TaskList = ({ tasks, headline = '', selectable = false }) => (
  <div className={styles.taskWrap}>
    {headline && <h3 className={styles.headline}>{headline}</h3>}
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
  headline: PropTypes.string,
  selectable: PropTypes.bool,
};

export default TaskList;
