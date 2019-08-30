import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { ClientContext } from '../Client';

import FormattedPrice from '../Utils/FormattedPrice';
import Description from './Description';

import styles from './Task.module.scss';

export const TaskContext = React.createContext();

const Task = ({ task, tag: Tag, userRef, children }) => {
  const { rate } = useContext(ClientContext);
  const taskRef = userRef.collection('tasks').doc(task.id);

  const handleSave = () => {
    console.log('saved');
  };

  return (
    <TaskContext.Provider value={{ taskRef, handleSave }}>
      <Tag className={styles.task}>
        <div className={styles.task__wrapper}>
          <Description value={task.description} className={styles.task__description} />

          <span className={styles.task__hours}>
            {task.hours !== 0 && (
              <>
                <input
                  type="number"
                  className={styles.task__hoursInput}
                  defaultValue={task.hours}
                  min="0"
                  step="0.01"
                />
                <span className={styles.task__hoursLabel}>&nbsp;hours</span>
              </>
            )}
          </span>

          <span className={styles.task__price}>
            <FormattedPrice price={task.hours === 0 ? task.price : task.hours * rate} />
            {task.hours === 0 && <input defaultValue={task.price} />}
          </span>
        </div>

        <div className={styles.task__util}>{children}</div>
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
