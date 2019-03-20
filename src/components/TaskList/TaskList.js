import React from 'react';
import PropTypes from 'prop-types';

import formatPrice from '../../util/formatPrice';

import TaskRow from './TaskRow';

import './TaskList.scss';

const TaskList = ({ tasks }) => {
  if (!tasks) {
    return null;
  }

  return (
    <>
      <ul className="TaskList">
        <TaskRow className="header" description="Description" hours="Hours" price="Price" />
        {tasks.map(({ id, description, hours, price }) => (
          <TaskRow
            key={id}
            description={description}
            hours={hours || '-'}
            price={formatPrice(price)}
          />
        ))}
      </ul>
    </>
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
};

export default TaskList;
