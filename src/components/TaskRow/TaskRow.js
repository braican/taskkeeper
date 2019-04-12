import React, { useEffect, useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ClientContext from '../../contexts/ClientContext';
import TaskListContext from '../../contexts/TaskListContext';

import TaskRowWrapper from './TaskRowWrapper';
import RowData from './RowData';
import TaskUtility from './TaskUtility';

import CompleteIcon from '../../svg/complete';
import './TaskRow.scss';

const mapStateToProps = state => ({ taskRef: state.refs.tasks });

const TaskRow = ({ taskRef, taskId, description, hours, price, hasUtility, canInvoice }) => {
  const { rate } = useContext(ClientContext);
  const { creatingInvoice, selectTask, selectedTasks } = useContext(TaskListContext);

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
        TaskRow row
        ${utilMenuActive ? ' utilMenuActive' : ''}
        ${isEditing ? ' editing' : ''}
        ${creatingInvoice ? ' can-invoice' : ''}
        ${isSelected && creatingInvoice ? ' selected' : ''}
      `}
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
        <button className={`save-edits${isEditing ? ' active' : ''}`} onClick={saveEdits}>
          <span>
            <CompleteIcon />
          </span>
        </button>
      )}

      {canInvoice && (
        <div className={`row-action${creatingInvoice ? ' active' : ''}`}>
          <button className={`toggle-select${isSelected ? ' selected' : ''}`} onClick={onSelect}>
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
  hasUtility: PropTypes.bool,
  canInvoice: PropTypes.bool,
};

export default connect(mapStateToProps)(TaskRow);
