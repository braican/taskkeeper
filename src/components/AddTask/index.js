import React, { useState } from 'react';
import FormEl from '../Forms/FormEl';
import { CSSTransition } from 'react-transition-group';

import Toggler from '../Forms/Toggler';
import CircleButton from '../Buttons/Circle';
import PlusIcon from '../../svg/Plus';
import CloseIcon from '../../svg/Close';

import styles from './AddTask.module.scss';
import trsStyles from './FormTransition.module.scss';

const AddTask = () => {
  const [addingTask, setAddingTask] = useState(false);
  const [unitLabel, setUnitLabel] = useState('Hours');

  const handleUnitChange = isFixed => {
    setUnitLabel(isFixed ? 'Price' : 'Hours');
  };

  return (
    <section className={styles.addTask}>
      {!addingTask && (
        <button className="button button--green" onClick={() => setAddingTask(true)}>
          Add task
        </button>
      )}
      <CSSTransition
        in={addingTask}
        timeout={{ enter: 200, exit: 0 }}
        classNames={{ ...trsStyles }}
        unmountOnExit>
        <form className={styles.form}>
          <div className={styles.formWrapper}>
            <FormEl
              className={styles.description}
              id="newTask-description"
              type="text"
              label="Description"
              inputConfig={{ placeholder: 'Add the task description...' }}
            />

            <div className={styles.toggler}>
              <Toggler off="Hours" on="Cost" onChange={handleUnitChange} />
            </div>

            <FormEl
              className={styles.unit}
              id="newTask-unit"
              type="number"
              label={unitLabel}
              inputConfig={{ min: '0', step: '0.01' }}
            />

            <div className={styles.actions}>
              <CircleButton icon={PlusIcon} />
            </div>
          </div>

          <button type="button" className={styles.close} onClick={() => setAddingTask(false)}>
            <CloseIcon />
          </button>
        </form>
      </CSSTransition>
    </section>
  );
};

export default AddTask;
