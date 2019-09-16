import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ClientContext } from '../Client';
import { task } from '../../utils/status';

import FadeInUp from '../Transitions/FadeInUp';
import FormEl from '../Forms/FormEl';
import Toggler from '../Forms/Toggler';
import CircleButton from '../Buttons/Circle';
import PlusIcon from '../../svg/Plus';
import CloseIcon from '../../svg/Close';

import styles from './AddTask.module.scss';

const AddTask = ({ userRef }) => {
  const [addingTask, setAddingTask] = useState(false);
  const [isFixedPrice, setIsFixedPrice] = useState(false);
  const [description, setDescription] = useState('');
  const [value, setValue] = useState(0);
  const { client } = useContext(ClientContext);

  const handleUnitChange = isFixed => {
    setIsFixedPrice(isFixed);
  };

  const handleSubmit = event => {
    event.preventDefault();

    if (!userRef) {
      return;
    }

    const taskData = {
      client: client.id,
      status: task.ESTIMATED,
      description,
      timestamp: +new Date(),
    };

    if (!isFixedPrice) {
      taskData.hours = parseFloat(value);
    } else {
      taskData.price = parseFloat(value);
    }

    userRef.collection('tasks').add(taskData);
    setDescription('');
    setValue('');
  };

  return (
    <section className={styles.addTask}>
      {!addingTask && (
        <button className="button button--green" onClick={() => setAddingTask(true)}>
          Add task
        </button>
      )}

      <FadeInUp in={addingTask} timeout={{ enter: 200, exit: 0 }} immediateOut>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formWrapper}>
            <FormEl
              className={styles.description}
              id="newTask-description"
              type="text"
              label="Description"
              inputConfig={{ placeholder: 'Add the task description...' }}
              value={description}
              onChange={e => setDescription(e.target.value)}
              absoluteLabel
            />

            <div className={styles.toggler}>
              <Toggler off="Hours" on="Fixed Price" onChange={handleUnitChange} />
            </div>

            <FormEl
              className={styles.unit}
              id="newTask-unit"
              label={isFixedPrice ? 'Price' : 'Hours'}
              type="number"
              inputConfig={{ min: '0', step: '0.01' }}
              value={value}
              onChange={e => setValue(e.target.value)}
              absoluteLabel
            />

            <div className={styles.actions}>
              <CircleButton icon={PlusIcon} />
            </div>
          </div>

          <button type="button" className={styles.close} onClick={() => setAddingTask(false)}>
            <CloseIcon />
          </button>
        </form>
      </FadeInUp>
    </section>
  );
};

AddTask.propTypes = {
  userRef: PropTypes.object,
};

AddTask.defaultProps = {
  userRef: null,
};

export default connect(({ userRef }) => ({ userRef }))(AddTask);
