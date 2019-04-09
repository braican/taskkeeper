import React, { useState, useContext, useEffect } from 'react';

import TaskListContext from '../../contexts/TaskListContext';

import CompleteIcon from '../../svg/complete';

const TaskRowHeader = () => {
  const [selectAll, setSelectAll] = useState(false);
  const { tasks, creatingInvoice, selectAllTasks, selectedTasks } = useContext(TaskListContext);

  const toggleSelectAll = () => {
    const newSelectAllStatus = !selectAll;
    const taskIds = tasks.map(({ id }) => id);
    setSelectAll(newSelectAllStatus);
    if (newSelectAllStatus) {
      selectAllTasks(taskIds);
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
    <li className={`TaskRow row header${creatingInvoice ? ' can-invoice' : ''}`}>
      <div className="wrapper">
        <span className="cell description">Description</span>
        <span className="cell hours">Hours</span>
        <span className="cell price">Price</span>
      </div>

      <div className={`row-action${creatingInvoice ? ' active' : ''}`}>
        <button
          className={`toggle-select${selectAll ? ' selected' : ''}`}
          onClick={toggleSelectAll}>
          <span>
            <CompleteIcon />
          </span>
        </button>
      </div>
    </li>
  );
};

export default TaskRowHeader;
