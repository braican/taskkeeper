import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import TaskRow from '../TaskRow';

import styles from './Invoice.module.scss';

const mapStateToProps = state => ({ taskRef: state.refs.tasks });

const Invoice = ({ invoice, taskRef }) => {
  const [invoiceTasks, setInvoiceTasks] = useState([]);

  useEffect(() => {
    if (!invoice.tasks) {
      return;
    }

    const taskPromises = invoice.tasks.map(taskId => taskRef.doc(taskId).get());
    Promise.all(taskPromises).then(taskDocs => {
      const localTasks = taskDocs.map(snap => ({ id: snap.id, ...snap.data() }));
      setInvoiceTasks(localTasks);
    });
  }, []);

  return (
    <div className={styles.Invoice}>
      <header>{invoice.id}</header>

      {invoiceTasks && (
        <div>
          <h6>Tasks</h6>
          <ul>
            {invoiceTasks.map(({ id, description, hours, price }) => (
              <TaskRow key={id} description={description} hours={hours} price={price} compact />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

Invoice.propTypes = {
  invoice: PropTypes.shape({
    client: PropTypes.string,
    id: PropTypes.string,
    status: PropTypes.string,
    tasks: PropTypes.arrayOf(PropTypes.string),
    timestamp: PropTypes.number,
  }),
  taskRef: PropTypes.object,
};

export default connect(mapStateToProps)(Invoice);
