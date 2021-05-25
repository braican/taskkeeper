import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import ContentEditable from 'react-contenteditable';
import classnames from 'classnames';
import { useClients, useAuth, useTasks } from 'hooks';

import Icon from 'components/ui/Icon';
import Button from 'components/ui/Button';

import styles from './Task.module.scss';

const Task = ({ task }) => {
  const { post } = useAuth();
  const { updateTask, deleteTask } = useTasks();
  const { client } = useClients();

  const description = useRef(task.description);
  const hours = useRef(task.hours);
  const hoursInput = useRef();

  const [message, setMessage] = useState('');
  const [price, setPrice] = useState(task.hours * client.rate);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleFocus = () => setMessage('Editing...');

  const remove = () => {
    deleteTask(task.id);
    post('deleteTask', { id: task.id });
  };

  const update = data =>
    post('updateTask', { id: task.id, ...data })
      .then(({ task }) => updateTask(task))
      .then(() => {
        setMessage('Saved');
        setTimeout(() => setMessage(''), 1400);
      });

  const handleDescriptionBlur = event => {
    const newDescription = event.target.innerHTML;

    if (newDescription === description.current) {
      setMessage('');
      return;
    }

    description.current = newDescription;

    setMessage('Saving...');
    update({ description: newDescription });
  };

  const handleHoursBlur = event => {
    const newHours = event.target.value;

    if (newHours === hours.current) {
      setMessage('');
      return;
    }

    setPrice(newHours * client.rate);

    hours.current = newHours;
    setMessage('Saving...');
    update({ hours: newHours });
  };

  return (
    <div className={styles.task}>
      <ContentEditable
        html={description.current}
        className={styles.description}
        tagName="p"
        onFocus={handleFocus}
        onBlur={handleDescriptionBlur}
      />

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

      <div className={styles.price}>${task.price === undefined ? price : ''}</div>

      <div className={styles.actions}>
        <button type="button" className={styles.move} title="Add Todo">
          <Icon viewBox="0 0 20 20" icon="checkmark" />
        </button>
        <button
          type="button"
          className={styles.trash}
          title="Delete"
          onClick={() => setShowDeleteModal(true)}>
          <Icon viewBox="0 0 20 20" icon="trash" />
        </button>
      </div>

      {showDeleteModal && (
        <div className={styles.deleteModal}>
          <p>Are you sure?</p>
          <Button type="button" style="warning" onClick={remove}>
            Yes
          </Button>
          <button type="button" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
        </div>
      )}

      {/* <div
        className={classnames(styles.utility, {
          [styles.utilityOpen]: utilityOpen,
          [styles.utilityForceClose]: message,
        })}>
        <button type="button" className={styles.trash}>
          <Icon label="Delete" viewBox="0 0 20 20" icon="trash" inline />
        </button>

      </div>

      <div
        className={classnames(styles.messageFlag, {
          [styles.messageFlagOpen]: message,
          [styles.messageFlagGreen]: message === 'Saved',
        })}>
        <p className={styles.message}>{message}</p>
      </div> */}
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
