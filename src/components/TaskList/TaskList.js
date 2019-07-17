import React, { useState } from 'react';
import PropTypes from 'prop-types';

import TaskListContext from '../../contexts/TaskListContext';

import TaskRowHeader from '../TaskRow/TaskRowHeader';
import TaskRow from '../TaskRow/TaskRow';
import InvoiceForm from '../InvoiceForm';

import computeTotal from '../../util/computeTotal';
import computeHours from '../../util/computeHours';
import formatPrice from '../../util/formatPrice';

import styles from './TaskList.module.scss';

const TaskList = ({ tasks, header, hasUtility, canInvoice }) => {
  if (!tasks) {
    return null;
  }

  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);

  const balance = computeTotal(tasks);
  const hours = computeHours(tasks);

  const selectTask = (selected, task) => {
    const newSelectedTasks = [...selectedTasks];
    const index = newSelectedTasks.map(task => task.id).indexOf(task.id);

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

  return (
    <TaskListContext.Provider
      value={{
        tasks,
        creatingInvoice,
        setCreatingInvoice,
        selectTask,
        selectAllTasks,
        selectedTasks,
        setSelectedTasks,
        hasUtility,
        canInvoice,
      }}>
      <section className="app-section">
        <header className={styles.header}>
          <h4>{header}</h4>
        </header>
        <ul>
          {tasks.length === 0 ? (
            <p>No tasks</p>
          ) : (
            <>
              <TaskRowHeader hasAction={canInvoice} />
              {tasks.map(({ id, description, hours, price }) => (
                <TaskRow
                  key={id}
                  taskId={id}
                  description={description}
                  hours={hours || '-'}
                  price={price}
                />
              ))}
              <li className={`${styles.footer} ${creatingInvoice ? styles.footerCanInvoice : ''}`}>
                <span className={styles.footerHours}>{hours}</span>
                <span className={styles.footerPrice}>{formatPrice(balance)}</span>
              </li>
            </>
          )}
        </ul>

        {tasks.length > 0 &&
          canInvoice &&
          (creatingInvoice ? (
            <InvoiceForm selectedTasks={selectedTasks} />
          ) : (
            <div className={styles.actions}>
              <button className="action-primary" onClick={() => setCreatingInvoice(true)}>
                Start Invoice
              </button>
            </div>
          ))}
      </section>
    </TaskListContext.Provider>
  );
};

TaskList.propTypes = {
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

export default TaskList;
