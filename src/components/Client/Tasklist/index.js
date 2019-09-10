import React from 'react';
import PropTypes from 'prop-types';
import Task from '../../Task';

import styles from './Tasklist.module.scss';

const Tasklist = ({ headline, tasks, noTasksMessage, canInvoice, utility: Utility }) => (
  <section className={styles.tasklist}>
    {headline && (
      <header>
        <h3 className="section-header">{headline}</h3>
      </header>
    )}

    {tasks && tasks.length > 0 ? (
      <ul>
        {tasks.map(task => (
          <Task task={task} tag="li" key={task.id} utility={Utility} canInvoice={canInvoice} />
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
  canInvoice: PropTypes.bool,
  utility: PropTypes.func,
};

Tasklist.defaultProps = {
  headline: null,
  tasks: [],
  noTasksMessage: null,
  canInvoice: false,
  utility: null,
};

export default Tasklist;
