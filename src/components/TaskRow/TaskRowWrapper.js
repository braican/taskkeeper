import React from 'react';
import PropTypes from 'prop-types';

const TaskRowWrapper = ({ clickable, onClick, children }) => {
  if (!clickable) {
    return <div className="wrapper">{children}</div>;
  }

  return (
    <button className="wrapper wrapper-clickable" onClick={onClick}>
      {children}
    </button>
  );
};

TaskRowWrapper.propTypes = {
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

export default TaskRowWrapper;
