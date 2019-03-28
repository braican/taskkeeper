import React from 'react';
import PropTypes from 'prop-types';

import computeTotal from '../../util/computeTotal';
import computeHours from '../../util/computeHours';
import formatPrice from '../../util/formatPrice';

import TaskRow from '../TaskRow/TaskRow';

import './TaskList.scss';

const TaskList = ({ tasks, header, hasUtility }) => {
  if (!tasks) {
    return null;
  }

  const balance = computeTotal(tasks);
  const hours = computeHours(tasks);

  return (
    <section className="TaskList">
      <header>{header}</header>
      <ul>
        {tasks.length === 0 ? (
          <p>No tasks</p>
        ) : (
          <>
            <TaskRow header description="Description" hours="Hours" price="Price" />
            {tasks.map(({ id, description, hours, price }) => (
              <TaskRow
                key={id}
                taskId={id}
                description={description}
                hours={hours || '-'}
                price={price}
                hasUtility={hasUtility}
              />
            ))}
            <li className="footer">
              <span className="hours">{hours}</span>
              <span className="price">{formatPrice(balance)}</span>
            </li>
          </>
        )}
      </ul>
    </section>
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
};

export default TaskList;
