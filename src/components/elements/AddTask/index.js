import React, { useState } from 'react';
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

  const { post } = useAuth();
  const { client } = useClients();
  const { addTask } = useTasks();

  const addTaskToDb = () => {
    if (!description) {
      return;
    }

    post('addTask', {
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
        setDescription('');
        setPrice(0);
        setHours(0);
        setIsFixedPrice(false);
      })
      .catch(console.error);
  };

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
    <Button onClick={() => setFormActive(true)} style={['orange']}>
      <Icon icon="plus-square" />
      <span>Add task</span>
    </Button>
  );
};

export default AddTask;
