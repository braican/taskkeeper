import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import { useClients } from 'hooks';

import Icon from 'components/ui/Icon';

import styles from './Task.module.scss';

const Task = ({ task }) => {
  const initialDescription = task.description;
  const initialHours = task.hours;

  const description = useRef(task.description);
  const [hours, setHours] = useState(task.hours);
  const hoursInput = useRef();

  const {
    client: { rate },
  } = useClients();

  const handleDescriptionBlur = event => {
    console.log(event.target.innerHTML);
  };
  const handleHoursBlur = event => {
    console.log(hours);
  };

  return (
    <div className={styles.task}>
      <div type="button" className={styles.taskData}>
        <ContentEditable
          html={description.current}
          className={styles.description}
          tagName="p"
          onBlur={handleDescriptionBlur}
        />

        {task.price === undefined && (
          <span className={styles.hoursWrap}>
            <button
              className={styles.hoursLabel}
              type="button"
              onClick={() => hoursInput?.current?.focus()}>
              hours:
            </button>
            <input
              type="number"
              value={hours}
              ref={hoursInput}
              onBlur={handleHoursBlur}
              className={styles.hours}
              onChange={event => setHours(event.target.value)}
            />
          </span>
        )}

        <span className={styles.price}>
          ${task.price === undefined ? parseFloat(task.hours) * rate : task.price}
        </span>
      </div>

      <div className={styles.utility}>
        <button type="button" className={styles.trash}>
          <Icon label="Delete" viewBox="0 0 20 20" icon="trash" inline />
        </button>
        <button type="button" className={styles.move}>
          <Icon label="To do" viewBox="0 0 20 20" icon="cheveron-down" inline />
        </button>
      </div>
    </div>
  );
};

Task.propTypes = {
  task: PropTypes.shape({
    description: PropTypes.string,
    hours: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    price: PropTypes.string,
  }),
};

export default Task;
