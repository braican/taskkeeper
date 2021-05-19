import React, { useState, useRef, useEffect } from 'react';
import { post } from 'util/index';
import { useClients, useTasks, useAuth } from 'hooks';

import FormModal from 'components/elements/FormModal';
import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';
import FormInput from 'components/ui/FormInput';
import Toggle from 'components/ui/Toggle';

import { TASK_STATUS } from 'constants.js';

import styles from './AddTask.module.scss';

const AddTask = () => {
  const [formActive, setFormActive] = useState(false);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [hours, setHours] = useState(0);
  const [isFixedPrice, setIsFixedPrice] = useState(false);

  const { userData } = useAuth();
  const { client } = useClients();
  const { addTask } = useTasks();

  const formEl = useRef();

  const addTaskToDb = () => {
    if (!description) {
      return;
    }

    post('addTask', {
      secret: userData.secret,
      task: {
        description,
        status: TASK_STATUS.estimated,
        hours: isFixedPrice ? null : hours,
        price: isFixedPrice ? price : null,
        client: client.id,
      },
    })
      .then(({ task }) => {
        addTask(task);
        setFormActive(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (formActive && formEl.current) {
      formEl.current.querySelector('input')?.focus();
    }
  }, [formActive]);

  if (formActive) {
    return (
      <FormModal headline="Add task" onSubmit={addTaskToDb} onCancel={() => setFormActive(false)}>
        <FormInput
          label="Description"
          required
          type="textarea"
          onChange={event => setDescription(event.target.value)}
          value={description}
        />

        <div className={styles.toggleRow}>
          <Toggle on="Fixed" off="Hourly" onChange={() => setIsFixedPrice(!isFixedPrice)} />

          <FormInput
            label={isFixedPrice ? 'Price' : 'Hours'}
            type="number"
            value={isFixedPrice ? price : hours}
            className={styles.unit}
            onChange={event =>
              isFixedPrice ? setPrice(event.target.value) : setHours(event.target.value)
            }
          />
        </div>
      </FormModal>
    );
  }

  return (
    <Button onClick={() => setFormActive(true)} style="green" className={styles.addNew}>
      <Icon viewBox="0 0 24 28" icon="plus-square" />
      <span>Add task</span>
    </Button>
  );
};

export default AddTask;
