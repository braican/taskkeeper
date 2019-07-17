import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TaskRow from '../TaskRow';

import prettyDate from '../../util/prettyDate';
import dueDateIn from '../../util/dueDateIn';
import getDate from '../../util/getDate';
import formatPrice from '../../util/formatPrice';

import ArrowIcon from '../../svg/arrow';
import styles from './Invoice.module.scss';

const mapStateToProps = state => ({
  taskRef: state.refs.tasks,
  invoiceRef: state.refs.invoices,
});

const Invoice = ({ taskRef, invoiceRef, invoice, active, display }) => {
  let _isMounted = false;
  const [invoiceTasks, setInvoiceTasks] = useState([]);
  const [tasksExpanded, setTasksExpanded] = useState(false);

  useEffect(() => {
    _isMounted = true;

    if (!invoice.tasks) {
      return;
    }

    const taskPromises = invoice.tasks.map(taskId => taskRef.doc(taskId).get());
    Promise.all(taskPromises).then(taskDocs => {
      if (_isMounted) {
        const localTasks = taskDocs.map(snap => ({ id: snap.id, ...snap.data() }));
        setInvoiceTasks(localTasks);
      }
    });

    return () => {
      _isMounted = false;
    };
  }, []);

  const markAsPaid = () => {
    invoiceRef.doc(invoice.id).update({
      status: 'fulfilled',
      fulfilledDate: getDate(),
    });
  };

  return (
    <div className={`${styles.Invoice} ${styles[`display-${display}`]}`}>
      <div className={styles.info}>
        {active && (
          <div className={styles.action}>
            <button className="action-primary" onClick={markAsPaid}>
              Mark as Paid
            </button>
          </div>
        )}

        <div className={styles.infoMain}>
          <p className={`${styles.metadata} ${styles.invoiceId}`}>{invoice.invoiceId}</p>
          <p className={`${styles.metadata} ${styles.price}`}>{formatPrice(invoice.price)}</p>

          {!active && (
            <div className={`${styles.metadata} ${styles.fulfilledDate}`}>
              <span className="label">Fulfilled On</span>
              <span className={styles.metadataValue}>{prettyDate(invoice.fulfilledDate)}</span>
            </div>
          )}

          {invoice.projectDescription && (
            <div className={`${styles.metadata} ${styles.description}`}>
              <span className="label">Description</span>
              <span className={styles.metadataValue}>{invoice.projectDescription}</span>
            </div>
          )}
        </div>

        {active && (
          <div className={styles.infoDates}>
            <div className={styles.metadata}>
              <span className="label">Due Date</span>
              <span className={styles.metadataValue}>
                {prettyDate(invoice.dueDate)} ({dueDateIn(invoice.dueDate)})
              </span>
            </div>
            <div className={styles.metadata}>
              <span className="label">Issue Date</span>
              <span className={styles.metadataValue}>{prettyDate(invoice.issueDate)}</span>
            </div>
          </div>
        )}
      </div>

      {invoiceTasks && (
        <div>
          <button
            className={`${styles.taskExpander} ${tasksExpanded ? styles.taskExpander_flipped : ''}`}
            onClick={() => setTasksExpanded(!tasksExpanded)}>
            <h6>Tasks</h6>
            <ArrowIcon />
          </button>
          <ul className={`${styles.taskList} ${tasksExpanded ? styles.taskList_expanded : ''}`}>
            {invoiceTasks.map(({ id, description, hours, price }) => (
              <TaskRow key={id} description={description} hours={hours} price={price} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Invoice.propTypes = {
  taskRef: PropTypes.object,
  invoiceRef: PropTypes.object,
  invoice: PropTypes.shape({
    id: PropTypes.string,
    client: PropTypes.string,
    dueDate: PropTypes.string,
    hours: PropTypes.number,
    fulfilledDate: PropTypes.string,
    invoiceId: PropTypes.string,
    issueDate: PropTypes.string,
    price: PropTypes.number,
    projectDescription: PropTypes.string,
    status: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.string),
    timestamp: PropTypes.number,
  }),
  active: PropTypes.bool,
  display: PropTypes.string,
};

Invoice.defaultProps = {
  display: 'list',
};

export default connect(mapStateToProps)(Invoice);
