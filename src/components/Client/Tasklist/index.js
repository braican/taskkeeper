import React from 'react';
import PropTypes from 'prop-types';
import Task from '../../Task';

import styles from './Tasklist.module.scss';

const Tasklist = ({ headline, tasks, noTasksMessage, utility: Utility }) => (
  <section className={styles.tasklist}>
    {headline && (
      <header>
        <h3 className={styles.header}>{headline}</h3>
      </header>
    )}

    {tasks && tasks.length > 0 ? (
      <ul>
        {tasks.map(task => (
          <Task task={task} tag="li" key={task.id} utility={Utility} />
        ))}
      </ul>
    ) : (
      noTasksMessage || <p>No tasks.</p>
    )}
  </section>
);

Tasklist.propTypes = {
  headline: PropTypes.string,
  tasks: PropTypes.array,
  noTasksMessage: PropTypes.node,
  utility: PropTypes.func,
};

Tasklist.defaultProps = {
  headline: null,
  tasks: [],
  noTasksMessage: null,
  utility: null,
};

export default Tasklist;
