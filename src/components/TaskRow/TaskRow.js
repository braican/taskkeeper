import React, { useEffect, useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import TaskContext from '../../contexts/TaskContext';
import ClientContext from '../../contexts/ClientContext';

import formatPrice from '../../util/formatPrice';

import TaskRowWrapper from './TaskRowWrapper';
import TaskUtility from './TaskUtility';

import CompleteIcon from '../../svg/complete';
import './TaskRow.scss';

const mapStateToProps = state => ({ uid: state.firebase.auth.uid });

const TaskRow = ({
  uid,
  firestore,
  taskId,
  description,
  hours,
  price,
  header,
  footer,
  hasUtility,
  canInvoice,
  creatingInvoice,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isInvoiceTask, setInvoiceTask] = useState(false);
  const [utilMenuActive, setUtilMenuActive] = useState(false);
  const [utilMenuStyles, setUtilMenuStyles] = useState({ left: '0', top: '0' });
  const [taskDescription, setDescription] = useState(description);
  const [taskHours, setHours] = useState(hours);
  const [taskPrice, setPrice] = useState(price);
  const { rate } = useContext(ClientContext);
  const rowRef = useRef();

  const isActionable = !header && !footer && hasUtility;

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

    firestore
      .collection('users')
      .doc(uid)
      .collection('tasks')
      .doc(taskId)
      .update({
        description: taskDescription,
        hours: taskHours,
        price: newPrice,
      });
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleOffClick);

    return () => {
      document.removeEventListener('mousedown', handleOffClick);
    };
  }, []);

  return (
    <li
      className={`
        TaskRow row
        ${header ? ' header' : ''}
        ${footer ? ' footer' : ''}
        ${utilMenuActive ? ' utilMenuActive' : ''}
        ${isEditing ? ' editing' : ''}
        ${isInvoiceTask ? ' should-invoice' : ''}
        ${creatingInvoice ? ' can-invoice' : ''}
      `}
      ref={rowRef}>
      <TaskContext.Provider value={{ uid, taskId, firestore, setIsEditing }}>
        <TaskRowWrapper clickable={isActionable} onClick={triggerUtilMenu}>
          <span className="cell description">
            {isEditing ? (
              <input
                type="text"
                defaultValue={taskDescription}
                onChange={e => setDescription(e.target.value)}
              />
            ) : (
              taskDescription
            )}
          </span>
          <span className="cell hours">
            {isEditing && hours !== '-' ? (
              <input
                type="number"
                defaultValue={taskHours}
                onChange={e => setHours(e.target.value)}
              />
            ) : (
              taskHours
            )}
          </span>
          <span className="cell price">
            {isEditing && hours === '-' ? (
              <input
                type="number"
                defaultValue={taskPrice}
                onChange={e => setPrice(e.target.value)}
              />
            ) : (
              <>{header ? taskPrice : formatPrice(taskPrice)}</>
            )}
          </span>
        </TaskRowWrapper>

        {!header && !footer && hasUtility && !isEditing && (
          <TaskUtility style={utilMenuStyles} active={utilMenuActive} />
        )}

        {isActionable && (
          <button className={`save-edits${isEditing ? ' active' : ''}`} onClick={saveEdits}>
            <span>
              <CompleteIcon />
            </span>
          </button>
        )}

        {canInvoice && (
          <div className={`toggle-invoiceable${creatingInvoice ? ' active' : ''}`}>
            <button
              className={`invoiceable-control${isInvoiceTask ? ' selected' : ''}`}
              onClick={() => setInvoiceTask(!isInvoiceTask)}>
              <span>
                <CompleteIcon />
              </span>
            </button>
          </div>
        )}
      </TaskContext.Provider>
    </li>
  );
};

TaskRow.propTypes = {
  uid: PropTypes.string,
  firestore: PropTypes.shape({
    collection: PropTypes.func,
  }),
  taskId: PropTypes.string,
  description: PropTypes.string,
  hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  price: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.element]),
  header: PropTypes.bool,
  footer: PropTypes.bool,
  hasUtility: PropTypes.bool,
  canInvoice: PropTypes.bool,
  creatingInvoice: PropTypes.bool,
};

export default compose(
  firestoreConnect(),
  connect(mapStateToProps),
)(TaskRow);
