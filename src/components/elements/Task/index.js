import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import ContentEditable from 'components/wrappers/WrappedContentEditable';
import { useClients, useAuth, useTasks, useNewInvoice } from 'hooks';

import Actions from 'components/elements/Task/Actions';

import styles from './Task.module.scss';

const Task = ({ task, selectable = false }) => {
  const { post } = useAuth();
  const { updateTask } = useTasks();
  const { client } = useClients();
  const { isInvoicing, addTask, removeTask } = useNewInvoice();

  const description = useRef(task.description);
  const hours = useRef(task.hours);
  const fixedPrice = useRef(task.price);
  const hoursInput = useRef();

  const [message, setMessage] = useState('');
  const [isSelected, setIsSelected] = useState(false);
  const [price, setPrice] = useState(task.price || task.hours * client.rate);

  const handleFocus = () => setMessage('Editing...');

  useEffect(() => {
    if (isInvoicing === false) {
      setIsSelected(false);
    }
  }, [isInvoicing]);

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
    <div className={classnames(styles.task, isSelected && isInvoicing && styles.taskSelected)}>
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

        {(!selectable || !isInvoicing) && (
          <div className={styles.actionsWrap}>
            <Actions task={task} message={message} />
          </div>
        )}

        {selectable && isInvoicing && (
          <label className={styles.invoiceTaskCheck}>
            <input
              type="checkbox"
              onChange={event => {
                if (event.target.checked) {
                  addTask(task);
                  setIsSelected(true);
                } else {
                  removeTask(task);
                  setIsSelected(false);
                }
              }}
            />
            <span>{isSelected ? 'Added!' : 'Add to invoice'}</span>
          </label>
        )}
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
  selectable: PropTypes.bool,
};

export default Task;
