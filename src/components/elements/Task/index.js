import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useClients } from 'hooks';

import Icon from 'components/ui/Icon';

import styles from './Task.module.scss';

const Task = ({ task }) => {
  const [open, setOpen] = useState(false);
  const {
    client: { rate },
  } = useClients();

  return (
    <>
      <button type="button" className={styles.taskData} onClick={() => setOpen(!open)}>
        <span className={styles.description}>{task.description}</span>

        {task.price === undefined && <span className={styles.hours}>{task.hours} hours</span>}

        <span className={styles.price}>
          ${task.price === undefined ? parseFloat(task.hours) * rate : task.price}
        </span>
      </button>
      {open && (
        <div className={styles.utility}>
          <button type="button" className={styles.trash}>
            <Icon label="Delete" viewBox="0 0 20 20" icon="trash" />
          </button>
          <button type="button" className={styles.move}>
            <Icon label="To do" viewBox="0 0 20 20" icon="cheveron-down" />
          </button>
        </div>
      )}
    </>
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
