import React, { useState } from 'react';
import PropTypes from 'prop-types';

import computeTotal from '../../util/computeTotal';
import computeHours from '../../util/computeHours';
import formatPrice from '../../util/formatPrice';

import TaskListContext from '../../contexts/TaskListContext';

import TaskRowHeader from '../TaskRow/TaskRowHeader';
import TaskRow from '../TaskRow/TaskRow';

import './TaskList.scss';

const TaskList = ({ tasks, header, hasUtility, canInvoice }) => {
  if (!tasks) {
    return null;
  }

  const [creatingInvoice, setCreatingInvoice] = useState(false);
  const [invoiceAll, setInvoiceAll] = useState(false);

  const balance = computeTotal(tasks);
  const hours = computeHours(tasks);

  return (
    <TaskListContext.Provider value={{ invoiceAll, creatingInvoice }}>
      <section className="TaskList">
        <header>
          <h4>{header}</h4>
        </header>
        <ul>
          {tasks.length === 0 ? (
            <p>No tasks</p>
          ) : (
            <>
              <TaskRowHeader setInvoiceAll={setInvoiceAll} />
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
          <div className="actions">
            <button
              className={`action-cancel${creatingInvoice ? ' active' : ''}`}
              onClick={() => setCreatingInvoice(false)}>
              Cancel
            </button>
            <button className="action-primary" onClick={() => setCreatingInvoice(true)}>
              {creatingInvoice ? 'Create' : 'Start'} Invoice
            </button>
          </div>
        )}
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
