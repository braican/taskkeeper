import { useState } from 'react';
import SlideUpModalForm from '@/components/slide-up-modal-form';
import styles from './task-form.module.css';

export default function TaskForm({
  visible = false,
  setVisibility,
}: {
  visible: boolean;
  setVisibility: (setVisibility: boolean) => void;
}) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState<'hourly' | 'fixed'>('hourly');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    try {
      // await addTask({description});
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
        {error && <div className="error-message">{error}</div>}

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
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
          </div>
        </div>
      </>
    </SlideUpModalForm>
  );
}
