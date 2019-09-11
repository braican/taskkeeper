import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import {
  computeTaskSubtotal,
  computeHours,
  computeTotal,
  getDate,
  className,
  prettyDate,
  dueDateIn,
} from '../../../utils';
import { invoice as invoiceStatus, task as taskStatus } from '../../../utils/status';

import FormattedPrice from '../../Utils/FormattedPrice';
import Metadata from '../../Utils/Metadata';
import FadeIn from '../../Transitions/FadeIn';

import ListIcon from '../../../svg/List';
import styles from './ActiveInvoice.module.scss';

const Invoice = ({ invoice, tasks, userRef, firestore }) => {
  const [showTasks, setShowTasks] = useState(false);

  const subtotal = tasks && tasks.length > 0 ? computeTotal(tasks, invoice.rate) : 0;
  const hours = computeHours(tasks);

  const handleMarkAsPaid = () => {
    if (!userRef) {
      return;
    }

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
        <div>
          <p>
            <FormattedPrice className={styles.subtotal} price={subtotal} />
          </p>
          <p>{hours} hours</p>
        </div>

        <div {...className('stack', styles.metadata)}>
          <p className={styles.invoiceId}>{invoice.invoiceId}</p>
          <Metadata value={prettyDate(invoice.issueDate)} label="Issued" />
          <Metadata
            value={`${prettyDate(invoice.dueDate)} (${dueDateIn(invoice.dueDate)})`}
            label="Due"
          />
          {invoice.description && <Metadata value={invoice.description} label="Description" />}
        </div>

        <div className={styles.actions}>
          {tasks && tasks.length > 0 && (
            <button
              {...className(styles.action, showTasks && styles.actionInvert)}
              type="button"
              onClick={() => setShowTasks(!showTasks)}>
              <ListIcon />
            </button>
          )}
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
                        <FormattedPrice price={computeTaskSubtotal(task, invoice.rate)} />
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
    rate: PropTypes.number,
  }).isRequired,
  tasks: PropTypes.array,
  userRef: PropTypes.object,
  firestore: PropTypes.object.isRequired,
};

Invoice.defaultProps = {
  tasks: [],
  userRef: null,
};

export default compose(
  firestoreConnect(),
  connect(({ userRef }) => ({ userRef })),
)(Invoice);
