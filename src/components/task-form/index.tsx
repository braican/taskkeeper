import { useState, useEffect } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import SlideUpModalForm from '@/components/slide-up-modal-form';
import Toggle from '@/components/toggle';
import { Client, Task } from '@/types';
import styles from './task-form.module.css';

export default function TaskForm({
  visible = false,
  setVisibility,
  client,
}: {
  visible: boolean;
  setVisibility: (setVisibility: boolean) => void;
  client: Client;
}) {
  const { addTask } = useTasks();
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [isHourly, setIsHourly] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      setDescription('');
      setValue('');
      setIsHourly(true);
      setError('');
    }
  }, [visible]);

  const handleSubmit = async () => {
    setError('');

    if (!description) {
      setError('You must supply a task description.');
      return;
    }

    try {
      const task: Omit<Task, 'id'> = {
        description,
        client: client.id,
        status: 'estimated',
        isHourly: false,
      };

      if (isHourly) {
        task.hours = Number(value);
        task.isHourly = true;
      } else {
        task.price = Number(value);
      }

      await addTask(task);
    } catch (err) {
      console.error(err);
      setError('Failed to save task.');
    } finally {
      setVisibility(false);
    }
  };

  return (
    <SlideUpModalForm
      visible={visible}
      title={'Add task'}
      onSubmit={handleSubmit}
      onCancel={() => setVisibility(false)}
    >
      <>
        {error && <div className="form-error-message">{error}</div>}

        <div className="form-row">
          <label className="form-label" htmlFor="task_description">
            Description
          </label>
          <textarea
            className="form-input"
            id="task_description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <div className={`form-row flex-fields ${styles.rateRow}`}>
          <Toggle
            id="rate_toggle_indicator"
            toggled={isHourly}
            onToggle={() => setIsHourly(!isHourly)}
            onLabel="Hourly"
            offLabel="Fixed"
          />

          <div className={styles.valueField}>
            <label className="form-label" htmlFor="task_value">
              {isHourly ? 'Hours' : 'Price'}
            </label>
            <div className={!isHourly ? styles.fixedValueInput : ''}>
              <input
                className="form-input"
                type="number"
                id="task_value"
                value={value}
                min={isHourly ? '0' : undefined}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
        </div>
      </>
    </SlideUpModalForm>
  );
}
