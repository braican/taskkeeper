import React, { useEffect, useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ClientContext from '../../contexts/ClientContext';
import TaskListContext from '../../contexts/TaskListContext';

import TaskRowWrapper from './TaskRowWrapper';
import RowData from './RowData';
import TaskUtility from './TaskUtility';

import CompleteIcon from '../../svg/complete';

import styles from './TaskRow.module.scss';

const mapStateToProps = state => ({ taskRef: state.refs.tasks });

const TaskRow = ({ taskRef, taskId, description, hours, price }) => {
  const { rate } = useContext(ClientContext);
  const { canInvoice, hasUtility, creatingInvoice, selectTask, selectedTasks } = useContext(
    TaskListContext,
  );

  const [taskDescription, setDescription] = useState(description);
  const [taskHours, setHours] = useState(hours);
  const [taskPrice, setPrice] = useState(price);

  const [isEditing, setIsEditing] = useState(false);
  const [isSelected, setSelected] = useState(false);

  const [utilMenuActive, setUtilMenuActive] = useState(false);
  const [utilMenuStyles, setUtilMenuStyles] = useState({ left: '0', top: '0' });

  const rowRef = useRef();

  const handleOffClick = event => {
    if (rowRef.current.contains(event.target)) {
      return;
    }

    setUtilMenuActive(false);
  };

  const triggerUtilMenu = event => {
    event.persist();

    const rowOffset = rowRef.current.getBoundingClientRect();
    const { clientX, clientY } = event;
    const relX = clientX - rowOffset.x;
    const relY = clientY - rowOffset.y;

    setUtilMenuStyles({
      left: `${relX}px`,
      top: `${relY}px`,
    });
    setUtilMenuActive(true);
  };

  const saveEdits = () => {
    const newPrice = hours === '-' ? taskPrice : taskHours * rate;
    setPrice(newPrice);
    setIsEditing(false);
    setUtilMenuActive(false);
    taskRef.doc(taskId).update({
      description: taskDescription,
      hours: taskHours,
      price: newPrice,
    });
  };

  const onSelect = () => {
    const newSelectedState = !isSelected;
    setSelected(newSelectedState);
    selectTask(newSelectedState, { id: taskId, price, hours });
  };

  useEffect(() => {
    if (selectedTasks) {
      setSelected(selectedTasks.map(task => task.id).includes(taskId));
    }

    document.addEventListener('mousedown', handleOffClick);

    return () => {
      document.removeEventListener('mousedown', handleOffClick);
    };
  }, [selectedTasks]);

  return (
    <li
      className={`
        ${styles.TaskRow}
        ${utilMenuActive ? ` ${styles.utilMenuActive}` : ''}
        ${isEditing ? ` ${styles.editing}` : ''}
        ${creatingInvoice ? ` ${styles.canInvoice}` : ''}
        ${isSelected && creatingInvoice ? ` ${styles.selected}` : ''}
      `.trim()}
      ref={rowRef}>
      <TaskRowWrapper clickable={hasUtility} onClick={triggerUtilMenu}>
        <RowData
          isEditing={isEditing}
          description={{ get: taskDescription, set: setDescription }}
          hours={{ get: taskHours, set: setHours }}
          price={{ get: taskPrice, set: setPrice }}
        />
      </TaskRowWrapper>

      {hasUtility && !isEditing && (
        <TaskUtility
          taskId={taskId}
          setIsEditing={setIsEditing}
          style={utilMenuStyles}
          active={utilMenuActive}
        />
      )}
      {hasUtility && (
        <button
          className={`${styles.saveEdits} ${isEditing ? styles.active : ''}`}
          onClick={saveEdits}>
          <span>
            <CompleteIcon />
          </span>
        </button>
      )}

      {canInvoice && (
        <div className={`${styles.rowAction} ${creatingInvoice ? styles.active : ''}`}>
          <button
            className={`${styles.toggleSelect} ${isSelected ? styles.selected : ''}`}
            onClick={onSelect}>
            <span>
              <CompleteIcon />
            </span>
          </button>
        </div>
      )}
    </li>
  );
};

TaskRow.propTypes = {
  taskRef: PropTypes.object,
  taskId: PropTypes.string,
  description: PropTypes.string,
  hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.element]),
};

export default connect(mapStateToProps)(TaskRow);
