import React, { useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { className } from '../../utils';

import { ClientContext } from '../Client';

import FadeIn from '../Transitions/FadeIn';
import Description from './Description';
import Hours from './Hours';
import Price from './Price';
import CheckmarkIcon from '../../svg/Checkmark';

import styles from './Task.module.scss';

export const TaskContext = React.createContext();

const Task = ({
  task,
  canInvoice,
  tag: Tag,
  utility: Utility,
  userRef,
  isInvoicing,
  addInvoiceTask,
  removeInvoiceTask,
}) => {
  const { id, hours, price: taskPrice, description } = task;
  const isFixedPrice = !hours || hours === 0;
  const taskRef = userRef ? userRef.collection('tasks').doc(id) : null;

  const { rate } = useContext(ClientContext);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Editing');
  const [isFocused, setFocus] = useState(false);
  const [price, setPrice] = useState(isFixedPrice ? taskPrice : hours * rate);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (isFixedPrice) {
      return;
    }
    setPrice(hours * rate);
  }, [rate]);

  useEffect(() => {
    if (isInvoicing === false) {
      setSelected(false);
    }
  }, [isInvoicing]);

  const handleSave = (newData, shouldSave) => {
    if (!taskRef || !shouldSave) {
      setIsEditing(false);
      return Promise.resolve();
    }

    setStatusMessage('Saving');

    return taskRef.update(newData).then(() => {
      setShowSaveAnimation(true);

      setTimeout(() => {
        setIsEditing(false);
      }, 1400);
    });
  };

  const handleInputFocus = () => {
    setShowSaveAnimation(false);
    setStatusMessage('Editing');
    setIsEditing(true);
  };

  const updateHours = newHours => {
    const newPrice = newHours * rate;
    setPrice(newPrice);
  };

  const handleSelect = () => {
    const newSelectState = !selected;
    setSelected(newSelectState);

    if (newSelectState) {
      addInvoiceTask(id, price, hours || 0);
    } else {
      removeInvoiceTask(id, price, hours || 0);
    }
  };

  return (
    <TaskContext.Provider
      value={{ taskRef, handleSave, price, setPrice, setIsEditing, handleInputFocus, setFocus }}>
      <Tag
        {...className(
          styles.task,
          isEditing && styles.editing,
          isFocused && styles.isFocused,
          canInvoice && isInvoicing && styles.isInvoicing,
        )}>
        {canInvoice && (
          <FadeIn in={isInvoicing}>
            <button
              {...className(styles.select, selected && styles.selectSelected)}
              onClick={handleSelect}>
              <span>
                <CheckmarkIcon />
              </span>
            </button>
          </FadeIn>
        )}

        <div className={styles.task__wrapper}>
          <Description value={description} className={styles.task__description} />

          <Hours className={styles.task__hours} value={hours} onChange={updateHours} />

          <Price isFixed={isFixedPrice} className={styles.task__price} />
        </div>

        <div className={styles.task__util}>
          <div className={styles.task__actions}>{Utility && <Utility taskRef={taskRef} />}</div>

          <FadeIn in={isEditing}>
            <div {...className(styles.task__status, showSaveAnimation && styles.task__statusSaved)}>
              <p className={styles.savingStatus}>{statusMessage}...</p>
              <span className={styles.savedSuccess}>
                <CheckmarkIcon />
              </span>
            </div>
          </FadeIn>
        </div>
      </Tag>
    </TaskContext.Provider>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  canInvoice: PropTypes.bool,
  tag: PropTypes.string,
  utility: PropTypes.func,
  userRef: PropTypes.object,
  isInvoicing: PropTypes.bool,
  addInvoiceTask: PropTypes.func.isRequired,
  removeInvoiceTask: PropTypes.func.isRequired,
};

Task.defaultProps = {
  canInvoice: false,
  tag: 'div',
  utility: null,
  userRef: null,
  isInvoicing: false,
};

export default connect(
  ({ userRef, invoice: { isInvoicing } }) => ({ userRef, isInvoicing }),
  dispatch => ({
    addInvoiceTask: (taskId, cost, hours) =>
      dispatch({ type: 'ADD_INVOICE_TASK', taskId, cost, hours }),
    removeInvoiceTask: (taskId, cost, hours) =>
      dispatch({ type: 'REMOVE_INVOICE_TASK', taskId, cost, hours }),
  }),
)(Task);
