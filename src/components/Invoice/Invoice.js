import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

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
    <div>
      <header>{invoice.id}</header>

      {invoiceTasks && (
        <ul>
          {invoiceTasks.map(task => (
            <li key={task.id}>
              <span>{task.description}</span>
              <span>{task.hours}</span>
              <span>{task.price}</span>
            </li>
          ))}
        </ul>
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
