import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth, useTasks } from 'hooks';

import Icon from 'components/ui/Icon';
import Button from 'components/ui/Button';

import { TASK_STATUS } from 'constants.js';

import styles from './Actions.module.scss';

const Actions = ({ task, message }) => {
  const { post } = useAuth();
  const { updateTask, deleteTask } = useTasks();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const removeTask = () => {
    deleteTask(task.id);
    post('deleteTask', { id: task.id });
  };

  const update = status => {
    updateTask({ ...task, status });
    return post('updateTask', { id: task.id, status });
  };

  const advanceTask = () => {
    let newStatus = null;

    if (task.status === TASK_STATUS.estimated) {
      newStatus = TASK_STATUS.todo;
    } else if (task.status === TASK_STATUS.todo) {
      newStatus = TASK_STATUS.completed;
    }

    if (!newStatus) {
      return;
    }

    update(newStatus);
  };

  const retreatTask = () => {
    let newStatus = null;

    if (task.status === TASK_STATUS.todo) {
      newStatus = TASK_STATUS.estimated;
    } else if (task.status === TASK_STATUS.completed) {
      newStatus = TASK_STATUS.todo;
    }

    if (!newStatus) {
      return;
    }

    update(newStatus);
  };

  if (message) {
    return (
      <div className={styles.actions}>
        <p className={styles.message}>{message}</p>
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      <button
        type="button"
        className={styles.trash}
        title="Delete"
        onClick={() => setShowDeleteModal(true)}>
        <Icon viewBox="0 0 20 20" icon="trash" />
      </button>

      {task.status === TASK_STATUS.estimated && (
        <button type="button" className={styles.advance} title="Todo" onClick={advanceTask}>
          <Icon viewBox="0 0 20 20" icon="cheveron-right" />
        </button>
      )}

      {task.status === TASK_STATUS.todo && (
        <>
          <button type="button" className={styles.retreat} title="Back" onClick={retreatTask}>
            <Icon viewBox="0 0 20 20" icon="cheveron-left" />
          </button>
          <button type="button" className={styles.done} title="Done" onClick={advanceTask}>
            <Icon viewBox="0 0 20 20" icon="checkmark" />
          </button>
        </>
      )}

      {task.status === TASK_STATUS.completed && (
        <button type="button" className={styles.retreat} title="Todo" onClick={retreatTask}>
          <Icon viewBox="0 0 20 20" icon="cheveron-left" />
        </button>
      )}

      {showDeleteModal && (
        <div className={styles.deleteModal}>
          <p>Are you sure you want to delete this task?</p>
          <Button type="button" style="warning" onClick={removeTask}>
            Yes
          </Button>
          <button type="button" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

Actions.propTypes = {
  task: PropTypes.shape({
    id: PropTypes.string,
    status: PropTypes.string,
  }),
  message: PropTypes.string,
};

export default Actions;
