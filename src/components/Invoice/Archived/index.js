import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import { prettyDate, computeTaskSubtotal, className } from '../../../utils';
import FormattedPrice from '../../Utils/FormattedPrice';
import Metadata from '../../Utils/Metadata';
import { ClientContext } from '../../Client';

import FadeIn from '../../Transitions/FadeIn';

import styles from './ArchivedInvoice.module.scss';

const ArchivedInvoice = ({ invoice, userRef }) => {
  const [tasksVisible, setTasksVisible] = useState(false);
  const [tasksLoaded, setTasksLoaded] = useState(false);
  const [tasks, setTasks] = useState([]);
  const clientData = useContext(ClientContext);

  // Legacy code to get a rate if the invoice itself doesn't have a rate.
  const rate = clientData ? clientData.rate : invoice.rate;

  const handleTaskToggler = () => {
    if (tasksLoaded) {
      setTasksVisible(!tasksVisible);
      return;
    }

    if (!userRef || invoice.tasks.length < 1) {
      return;
    }

    const taskPromises = invoice.tasks.map(taskId =>
      userRef
        .collection('tasks')
        .doc(taskId)
        .get(),
    );
    Promise.all(taskPromises).then(taskDocs => {
      const localTasks = taskDocs.map(snap => ({ id: snap.id, ...snap.data() }));
      setTasks(localTasks);
      setTasksLoaded(true);
      setTasksVisible(true);
    });
  };

  return (
    <div {...className(styles.invoice, tasksVisible && styles.invoiceWithTasks)}>
      <div className={styles.data}>
        <span className={styles.invoiceId}>{invoice.invoiceId}</span>
        <span className={styles.fulfilledDate}>{prettyDate(invoice.issueDate)}</span>
        <span className={styles.hours}>
          {invoice.hours} hour{invoice.hours === 1 ? '' : 's'}
        </span>
        <span className={styles.price}>
          <FormattedPrice price={invoice.price} />
        </span>

        <button
          type="button"
          onClick={handleTaskToggler}
          {...className(styles.showTasks, tasksVisible && styles.showTasksFixed)}>
          {tasksVisible ? 'Hide' : 'Show'} details
        </button>
      </div>

      <FadeIn in={tasksVisible} immediateOut>
        <div className={styles.details}>
          {invoice.description && <Metadata value={invoice.description} label="Description" />}

          <div className={styles.taskWrapper}>
            <span className="label">Tasks</span>
            <table className={styles.tasks}>
              <tbody>
                {tasks.map(task => (
                  <tr key={`${invoice.invoiceId}_${task.id}`}>
                    <td>{task.description}</td>
                    <td className={styles.hoursCell}>
                      {task.hours
                        ? `${task.hours} hour${parseFloat(task.hours) === 1 ? '' : 's'}`
                        : ''}
                    </td>
                    <td className={styles.subtotalCell}>
                      <FormattedPrice price={computeTaskSubtotal(task, rate)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

ArchivedInvoice.propTypes = {
  invoice: PropTypes.shape({
    invoiceId: PropTypes.string,
    fulfilledDate: PropTypes.string,
    issueDate: PropTypes.string,
    price: PropTypes.number,
    hours: PropTypes.number,
    tasks: PropTypes.array,
    description: PropTypes.string,
    rate: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  userRef: PropTypes.object,
};

ArchivedInvoice.defaultProps = {
  userRef: null,
};

export default compose(
  firestoreConnect(),
  connect(({ userRef }) => ({ userRef })),
)(ArchivedInvoice);
