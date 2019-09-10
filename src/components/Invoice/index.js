import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';

import { ClientContext } from '../Client';
import {
  computeTaskSubtotal,
  computeHours,
  computeTotal,
  className,
  prettyDate,
  dueDateIn,
} from '../../utils';
import FormattedPrice from '../Utils/FormattedPrice';
import Metadata from '../Utils/Metadata';
import FadeIn from '../Transitions/FadeIn';

import ListIcon from '../../svg/List';
import styles from './Invoice.module.scss';

const Invoice = ({ invoice, tasks }) => {
  const { rate } = useContext(ClientContext);
  const [showTasks, setShowTasks] = useState(false);

  const subtotal = computeTotal(tasks, parseFloat(rate));
  const hours = computeHours(tasks);

  return (
    <div className={styles.invoice}>
      <div className={styles.header}>
        <div {...className('stack', styles.metadata)}>
          <p>{invoice.invoiceId}</p>
          <Metadata value={prettyDate(invoice.issueDate)} label="Issued" />
          <Metadata
            value={`${prettyDate(invoice.dueDate)} (${dueDateIn(invoice.dueDate)})`}
            label="Due"
          />
          {invoice.description && <Metadata value={invoice.description} label="Description" />}
        </div>

        <div>
          <p>
            <FormattedPrice className={styles.subtotal} price={subtotal} />
          </p>
          <p>{hours} hours</p>
        </div>

        <div className={styles.actions}>
          <button
            {...className(styles.action, showTasks && styles.actionInvert)}
            type="button"
            onClick={() => setShowTasks(!showTasks)}>
            <ListIcon />
          </button>
        </div>
      </div>

      {tasks && tasks.length > 0 && (
        <FadeIn in={showTasks} immediateOut>
          <div className={styles.tasks}>
            <table>
              <tbody>
                {tasks.map(task => {
                  return (
                    <tr key={`${invoice.invoiceId}_${task.id}`}>
                      <td>{task.description}</td>
                      <td className={styles.hoursCell}>
                        {task.hours ? `${task.hours} hours` : ' '}
                      </td>
                      <td className={styles.subtotalCell}>
                        <FormattedPrice price={computeTaskSubtotal(task, rate)} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </FadeIn>
      )}

      <button className={styles.markPaid} type="button">
        Mark as Paid
      </button>
    </div>
  );
};

Invoice.propTypes = {
  invoice: PropTypes.shape({
    invoiceId: PropTypes.string,
    issueDate: PropTypes.string,
    dueDate: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  tasks: PropTypes.array,
};

Invoice.defaultProps = {
  tasks: [],
};

export default Invoice;
