import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import computeTotal from '../../util/computeTotal';
import computeHours from '../../util/computeHours';
import formatPrice from '../../util/formatPrice';

import TaskListContext from '../../contexts/TaskListContext';
import ClientContext from '../../contexts/ClientContext';

import TaskRowHeader from '../TaskRow/TaskRowHeader';
import TaskRow from '../TaskRow/TaskRow';

import './TaskList.scss';

const mapStateToProps = state => ({
  uid: state.firebase.auth.uid,
  taskRef: state.refs.tasks,
  invoiceRef: state.refs.invoices,
});

const TaskList = ({ firestore, taskRef, invoiceRef, tasks, header, hasUtility, canInvoice }) => {
  if (!tasks) {
    return null;
  }

  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const { clientId } = useContext(ClientContext);

  const balance = computeTotal(tasks);
  const hours = computeHours(tasks);

  const selectTask = (selected, task) => {
    const newSelectedTasks = [...selectedTasks];
    const index = newSelectedTasks.indexOf(task);
    if (selected) {
      newSelectedTasks.push(task);
      setSelectedTasks(newSelectedTasks);
    } else if (index > -1) {
      newSelectedTasks.splice(index, 1);
      setSelectedTasks(newSelectedTasks);
    }
  };

  const selectAllTasks = tasks => {
    setSelectedTasks(tasks);
  };

  const createInvoice = () => {
    if (selectedTasks.length === 0) {
      console.error('You need to select at least one task to invoice.');
      return;
    }

    const batch = firestore.batch();
    selectedTasks.forEach(task => {
      const singleTaskRef = taskRef.doc(task);
      batch.update(singleTaskRef, { status: 'invoiced' });
    });

    batch.commit();

    invoiceRef.add({
      client: clientId,
      status: 'active',
      tasks: selectedTasks,
      timestamp: +new Date(),
    });
  };

  return (
    <TaskListContext.Provider
      value={{ tasks, creatingInvoice, selectTask, selectAllTasks, selectedTasks }}>
      <section className="TaskList">
        <header>
          <h4>{header}</h4>
        </header>
        <ul>
          {tasks.length === 0 ? (
            <p>No tasks</p>
          ) : (
            <>
              <TaskRowHeader />
              {tasks.map(({ id, description, hours, price }) => (
                <TaskRow
                  key={id}
                  taskId={id}
                  description={description}
                  hours={hours || '-'}
                  price={price}
                  hasUtility={hasUtility}
                  canInvoice={canInvoice}
                />
              ))}
              <li className="footer">
                <span className="hours">{hours}</span>
                <span className="price">{formatPrice(balance)}</span>
              </li>
            </>
          )}
        </ul>

        {tasks.length > 0 && canInvoice && (
          <>
            <div className={`invoice-data${creatingInvoice ? ' active' : ''}`}>
              <label htmlFor="invoice-issue-date">Issue Date</label>
              <input type="date" id="invoice-issue-date" />

              <label htmlFor="invoice-due-date">Due Date</label>
              <input type="date" id="invoice-due-date" />

              <label htmlFor="invoice-id">Invoice ID</label>
              <input type="text" id="invoice-id" />

              <label htmlFor="invoice-project-description">Project Description</label>
              <textarea id="invoice-project-description" cols="30" rows="2" />
            </div>

            <div className="actions">
              <button
                className={`action-cancel${creatingInvoice ? ' active' : ''}`}
                onClick={() => setCreatingInvoice(false)}>
                Cancel
              </button>
              {creatingInvoice ? (
                <button className="action-primary" onClick={createInvoice}>
                  Create Invoice
                </button>
              ) : (
                <button className="action-primary" onClick={() => setCreatingInvoice(true)}>
                  Start Invoice
                </button>
              )}
            </div>
          </>
        )}
      </section>
    </TaskListContext.Provider>
  );
};

TaskList.propTypes = {
  firestore: PropTypes.object,
  taskRef: PropTypes.object,
  invoiceRef: PropTypes.object,
  tasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      client: PropTypes.string,
      description: PropTypes.string,
      hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ),
  header: PropTypes.string,
  hasUtility: PropTypes.bool,
  canInvoice: PropTypes.bool,
};

export default compose(
  firestoreConnect(),
  connect(mapStateToProps),
)(TaskList);
