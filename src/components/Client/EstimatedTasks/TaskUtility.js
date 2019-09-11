import React, { useState, useContext } from 'react';

import { TaskContext } from '../../Task';

import { className } from '../../../utils';
import { task } from '../../../utils/status';
import FadeInLeft from '../../Transitions/FadeInLeft';

import CircleButton from '../../Buttons/Circle';
import TrashButton from '../../Buttons/Trash';
import CompleteIcon from '../../../svg/Complete';

import styles from './TaskUtility.module.scss';

const TaskUtility = () => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { taskRef, setFocus } = useContext(TaskContext);

  const handleComplete = () => {
    if (!taskRef) {
      return;
    }

    taskRef.update({ status: task.COMPLETED });
  };

  const handlePromptDelete = () => {
    setConfirmDelete(true);
    setFocus(true);
  };

  const handleCancel = () => {
    setConfirmDelete(false);
    setFocus(false);
  };

  const handleDelete = () => {
    if (!taskRef) {
      return;
    }

    taskRef.delete();
  };

  return (
    <>
      <CircleButton onClick={handleComplete} icon={CompleteIcon} label="Completed" />
      <div className={styles.delete}>
        <TrashButton onClick={handlePromptDelete} />

        <FadeInLeft in={confirmDelete}>
          <div className={styles.delete__confirmWrapper}>
            <div className={styles.delete__confirm}>
              <span>Really delete?</span>

              <div className={styles.delete__actions}>
                <button
                  {...className('button', styles.confirm)}
                  type="button"
                  onClick={handleDelete}>
                  Yes
                </button>
                <button className={styles.cancel} type="button" onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </FadeInLeft>
      </div>
    </>
  );
};

export default TaskUtility;
