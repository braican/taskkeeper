import { useState, useEffect } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import SlideUpModalForm from '@/components/slide-up-modal-form';
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
  const [unit, setUnit] = useState<'hourly' | 'fixed'>('hourly');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      setDescription('');
      setValue('');
      setUnit('hourly');
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
      };

      if (unit === 'hourly') {
        task.hours = Number(value);
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
          <div className={styles.rateToggle}>
            <input
              className={`${styles.rateCheckbox} sr-only`}
              type="checkbox"
              id="rate_toggle_indicator"
              checked={unit === 'fixed'}
              onChange={() => setUnit(unit === 'hourly' ? 'fixed' : 'hourly')}
            />
            <button
              type="button"
              onClick={() => setUnit('hourly')}
              className={styles.hourlyLabel}
            >
              Hourly
            </button>
            <label
              htmlFor="rate_toggle_indicator"
              className={styles.toggleIndicator}
            ></label>
            <button
              type="button"
              onClick={() => setUnit('fixed')}
              className={styles.fixedLabel}
            >
              Fixed
            </button>
          </div>
          <div className={styles.valueField}>
            <label className="form-label" htmlFor="task_value">
              {unit === 'fixed' ? 'Price' : 'Hours'}
            </label>
            <div className={unit === 'fixed' ? styles.fixedValueInput : ''}>
              <input
                className="form-input"
                type="number"
                id="task_value"
                value={value}
                min={unit !== 'fixed' ? '0' : undefined}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
        </div>
      </>
    </SlideUpModalForm>
  );
}
