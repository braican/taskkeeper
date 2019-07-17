import React, { useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

import TaskListContext from '../../contexts/TaskListContext';

import CompleteIcon from '../../svg/complete';

import styles from './TaskRow.module.scss';

const TaskRowHeader = ({ hasAction }) => {
  const [selectAll, setSelectAll] = useState(false);
  const { tasks, creatingInvoice, selectAllTasks, selectedTasks } = useContext(TaskListContext);

  const toggleSelectAll = () => {
    const newSelectAllStatus = !selectAll;
    const allTasksMapped = tasks.map(({ id, price }) => ({ id, price }));
    setSelectAll(newSelectAllStatus);
    if (newSelectAllStatus) {
      selectAllTasks(allTasksMapped);
    } else if (selectedTasks.length === tasks.length) {
      selectAllTasks([]);
    }
  };

  useEffect(() => {
    if (selectedTasks.length < tasks.length) {
      setSelectAll(false);
    } else {
      setSelectAll(true);
    }
  }, [selectedTasks]);

  return (
    <li
      className={`${styles.TaskRow} ${styles.header} ${creatingInvoice ? styles.canInvoice : ''}`}>
      <div className={styles.wrapper}>
        <span className={`${styles.cell} ${styles.description}`}>Description</span>
        <span className={`${styles.cell} ${styles.hours}`}>Hours</span>
        <span className={`${styles.cell} ${styles.price}`}>Price</span>
      </div>

      {hasAction && (
        <div className={`${styles.rowAction} ${creatingInvoice ? styles.active : ''}`}>
          <button
            className={`${styles.toggleSelect} ${selectAll ? styles.selected : ''}`}
            onClick={toggleSelectAll}>
            <span>
              <CompleteIcon />
            </span>
          </button>
        </div>
      )}
    </li>
  );
};

TaskRowHeader.propTypes = {
  hasAction: PropTypes.bool,
};

export default TaskRowHeader;
