import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import FormattedPrice from '../Utils/FormattedPrice';
import ContentEditable from 'react-contenteditable';
import { ClientContext } from '../Client';

import styles from './Task.module.scss';

const Task = ({ task, tag: Tag, children }) => {
  const { rate } = useContext(ClientContext);

  return (
    <Tag className={styles.task}>
      <div className={styles.task__wrapper}>
        <ContentEditable
          html={task.description}
          disabled={false}
          className={styles.task__description}
          tagName="p"
        />

        <span className={styles.task__hours}>
          {task.hours !== 0 && (
            <>
              <input
                type="number"
                className={styles.task__hoursInput}
                defaultValue={task.hours}
                min="0"
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
  );
};

Task.defaultProps = {
  tag: 'div',
  children: null,
};

Task.propTypes = {
  task: PropTypes.shape({
    description: PropTypes.string,
    hours: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  tag: PropTypes.string,
  children: PropTypes.node,
};

export default Task;
