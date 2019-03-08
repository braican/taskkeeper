import React from 'react';
import PropTypes from 'prop-types';

const TaskRow = ({ className, description, hours, price }) => (
  <li className={`row ${className || ''}`}>
    <span className="cell description">{description}</span>
    <span className="cell hours">{hours}</span>
    <span className="cell price">{price}</span>
  </li>
);

TaskRow.propTypes = {
  className: PropTypes.string,
  description: PropTypes.string,
  hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.element]),
};

export default TaskRow;
