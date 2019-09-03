import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
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

const Task = ({ task, tag: Tag, userRef, children }) => {
  const { rate } = useContext(ClientContext);
  const isFixedPrice = !task.hours || task.hours === 0;
  const taskRef = userRef.collection('tasks').doc(task.id);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaveAnimation, setShowSaveAnimation] = useState(false);
  const [statusMessage, setStatusMessage] = useState('Editing');
  const [price, setPrice] = useState(isFixedPrice ? task.price : task.hours * rate);

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

  const handleFocus = () => {
    setShowSaveAnimation(false);
    setStatusMessage('Editing');
    setIsEditing(true);
  };

  const updatePrice = newHours => {
    const newPrice = newHours * rate;
    setPrice(newPrice);
  };

  return (
    <TaskContext.Provider
      value={{ taskRef, handleSave, price, setPrice, setIsEditing, handleFocus }}>
      <Tag {...className(styles.task, isEditing && styles.editing)}>
        <div className={styles.task__wrapper}>
          <Description value={task.description} className={styles.task__description} />

          <Hours className={styles.task__hours} value={task.hours} onChange={updatePrice} />

          <Price isFixed={isFixedPrice} className={styles.task__price} />
        </div>

        <div className={styles.task__util}>{children}</div>

        <FadeIn in={isEditing}>
          <div {...className(styles.task__status, showSaveAnimation && styles.task__statusSaved)}>
            <p className={styles.savingStatus}>{statusMessage}...</p>
            <span className={styles.savedSuccess}>
              <CheckmarkIcon />
            </span>
          </div>
        </FadeIn>
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
  tag: PropTypes.string,
  userRef: PropTypes.object,
  children: PropTypes.node,
};

Task.defaultProps = {
  tag: 'div',
  userRef: null,
  children: null,
};

export default compose(connect(({ userRef }) => ({ userRef })))(Task);
