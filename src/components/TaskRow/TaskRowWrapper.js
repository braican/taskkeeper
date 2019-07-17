import React from 'react';
import PropTypes from 'prop-types';

import styles from './TaskRow.module.scss';

const TaskRowWrapper = ({ clickable, onClick, children }) => {
  if (!clickable) {
    return <div className={styles.wrapper}>{children}</div>;
  }

  return (
    <button className={`${styles.wrapper} ${styles.wrapperClickable}`} onClick={onClick}>
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
