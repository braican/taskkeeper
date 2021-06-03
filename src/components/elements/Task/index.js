import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ContentEditable from 'components/wrappers/WrappedContentEditable';
import { useClients, useAuth, useTasks } from 'hooks';

import Actions from 'components/elements/Task/Actions';

import styles from './Task.module.scss';

const Task = ({ task }) => {
  const { post } = useAuth();
  const { updateTask } = useTasks();
  const { client } = useClients();

  const description = useRef(task.description);
  const hours = useRef(task.hours);
  const fixedPrice = useRef(task.price);
  const hoursInput = useRef();

  const [message, setMessage] = useState('');
  const [price, setPrice] = useState(task.price || task.hours * client.rate);

  const handleFocus = () => setMessage('Editing...');

  const update = data => {
    setMessage('Saving...');

    return post('updateTask', { id: task.id, ...data })
      .then(({ task }) => updateTask(task))
      .then(() => {
        setMessage('Saved');
        setTimeout(() => setMessage(''), 1400);
      });
  };

  const handleDescriptionBlur = event => {
    const newDescription = event.target.innerHTML;

    if (newDescription === description.current) {
      setMessage('');
      return;
    }

    description.current = newDescription;
    update({ description: newDescription });
  };

  const handleHoursBlur = event => {
    const newHours = event.target.value;

    if (newHours === hours.current) {
      setMessage('');
      return;
    }

    hours.current = newHours;

    setPrice(newHours * client.rate);
    update({ hours: newHours });
  };

  const handlePriceBlur = event => {
    const newFixedPrice = event.target.value;

    if (newFixedPrice === fixedPrice.current) {
      setMessage('');
      return;
    }

    fixedPrice.current = newFixedPrice;
    setPrice(newFixedPrice);
    update({ price: newFixedPrice });
  };

  return (
    <div className={styles.task}>
      <div className={styles.row1}>
        <ContentEditable
          html={description.current}
          className={styles.description}
          tagName="p"
          onFocus={handleFocus}
          onBlur={handleDescriptionBlur}
        />

        <div className={styles.priceWrap}>
          <div
            className={classnames(styles.price, task.price !== undefined && styles.priceEditable)}>
            ${price}
          </div>

          {task.price !== undefined && (
            <input
              type="number"
              defaultValue={fixedPrice.current}
              onFocus={handleFocus}
              onBlur={handlePriceBlur}
              className={styles.priceInput}
            />
          )}
        </div>
      </div>

      <div className={styles.row2}>
        {task.price === undefined && (
          <div className={styles.hoursWrap}>
            <button
              className={styles.hoursLabel}
              type="button"
              onClick={() => hoursInput?.current?.focus()}>
              hours:
            </button>
            <input
              type="number"
              defaultValue={hours.current}
              ref={hoursInput}
              onFocus={handleFocus}
              onBlur={handleHoursBlur}
              className={styles.hours}
            />
          </div>
        )}

        <div className={styles.actionsWrap}>
          <Actions task={task} message={message} />
        </div>
      </div>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string,
    hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.string,
  }),
};

export default Task;
