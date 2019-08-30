import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { ClientContext } from '../Client';

import Description from './Description';
import Hours from './Hours';
import Price from './Price';

import styles from './Task.module.scss';

export const TaskContext = React.createContext();

const Task = ({ task, tag: Tag, userRef, children }) => {
  const { rate } = useContext(ClientContext);
  const isFixedPrice = !task.hours || task.hours === 0;
  const taskRef = userRef.collection('tasks').doc(task.id);
  const [price, setPrice] = useState(isFixedPrice ? task.price : task.hours * rate);

  console.log(price);

  const handleSave = () => {
    console.log('saved');
  };

  const updatePrice = newHours => {
    const newPrice = newHours * rate;
    console.log(newPrice);

    setPrice(newPrice);
  };

  return (
    <TaskContext.Provider value={{ taskRef, handleSave, price, setPrice }}>
      <Tag className={styles.task}>
        <div className={styles.task__wrapper}>
          <Description value={task.description} className={styles.task__description} />

          <Hours className={styles.task__hours} value={task.hours} onChange={updatePrice} />

          <Price isFixed={isFixedPrice} className={styles.task__price} />
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
