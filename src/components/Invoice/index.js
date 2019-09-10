import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import { ClientContext } from '../Client';
import {
  computeTaskSubtotal,
  computeHours,
  computeTotal,
  getDate,
  className,
  prettyDate,
  dueDateIn,
} from '../../utils';
import { invoice as invoiceStatus, task as taskStatus } from '../../utils/status';

import FormattedPrice from '../Utils/FormattedPrice';
import Metadata from '../Utils/Metadata';
import FadeIn from '../Transitions/FadeIn';

import ListIcon from '../../svg/List';
import styles from './Invoice.module.scss';

const Invoice = ({ invoice, tasks, userRef, firestore }) => {
  const { rate } = useContext(ClientContext);
  const [showTasks, setShowTasks] = useState(false);

  const subtotal = computeTotal(tasks, parseFloat(rate));
  const hours = computeHours(tasks);

  const handleMarkAsPaid = () => {
    const batch = firestore.batch();
    const invoiceRef = userRef.collection('invoices').doc(invoice.id);

    batch.update(invoiceRef, {
      price: subtotal,
      hours,
      fulfilledDate: getDate(),
      status: invoiceStatus.FULFILLED,
    });

    tasks.forEach(task => {
      const taskRef = userRef.collection('tasks').doc(task.id);
      batch.update(taskRef, { status: taskStatus.ARCHIVED });
    });

    batch.commit();
  };

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

      <button className={styles.markPaid} type="button" onClick={handleMarkAsPaid}>
        Mark as Paid
      </button>
    </div>
  );
};

Invoice.propTypes = {
  invoice: PropTypes.shape({
    id: PropTypes.string,
    invoiceId: PropTypes.string,
    issueDate: PropTypes.string,
    dueDate: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
  tasks: PropTypes.array,
  userRef: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
};

Invoice.defaultProps = {
  tasks: [],
};

export default compose(
  firestoreConnect(),
  connect(({ userRef }) => ({ userRef })),
)(Invoice);
