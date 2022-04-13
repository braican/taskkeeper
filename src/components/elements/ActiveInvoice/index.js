import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import Button from '../../ui/Button';
import Icon from '../../ui/Icon';

import styles from './ActiveInvoice.module.scss';

const ActiveInvoice = ({ invoice }) => {
  const [showTasks, setShowTasks] = useState(false);

  const hours = invoice.tasks.reduce(
    (total, { hours }) => (hours ? parseFloat(hours) + total : total),
    0,
  );

  return (
    <article className={styles.invoice}>
      <div className={styles.meta}>
        <span className={styles.id}>{invoice.invoiceId}</span>

        <dl>
          <dt className={styles.label}>Issued</dt>
          <dd className={styles.value}>{invoice.issued}</dd>

          <dt className={styles.label}>Due</dt>
          <dd className={styles.value}>{invoice.due}</dd>
        </dl>
      </div>
      <div>
        <span className={styles.total}>${invoice.total}</span>
        <span className={styles.hours}>{hours} hours</span>
      </div>
      <div className={styles.description}>
        {invoice.description && <p className={styles.descriptionText}>{invoice.description}</p>}

        <button
          className={classnames(styles.taskToggle, showTasks ? styles.taskToggleFlipped : '')}
          onClick={() => setShowTasks(!showTasks)}
          title={`${showTasks ? 'Hide' : 'Show'} tasks`}>
          <Icon
            viewBox="0 0 20 20"
            icon="cheveron-down"
            label={`${showTasks ? 'Hide' : 'Show'} tasks`}
            inline
          />
        </button>
      </div>

      {showTasks && (
        <ul className={styles.tasks}>
          {invoice.tasks.map(task => {
            const hours = task.hours || 0;
            const total = task.price || parseFloat(hours) * parseFloat(invoice.rate);

            return (
              <li key={task.id} className={styles.task}>
                <span>{task.description}</span>
                <span>{hours > 0 ? `${hours} hrs` : ''}</span>
                <span className={styles.taskTotal}>${total}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.action}>
        <Button style={['fullwidth', 'orange']}>Paid</Button>
      </div>
    </article>
  );
};

ActiveInvoice.propTypes = {
  invoice: PropTypes.shape({
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    invoiceId: PropTypes.string,
    issued: PropTypes.string,
    due: PropTypes.string,
    description: PropTypes.string,
    tasks: PropTypes.array,
  }),
};

export default ActiveInvoice;
