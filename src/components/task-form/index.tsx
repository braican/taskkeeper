import { useState, RefObject } from 'react';
import Button from '@/components/button';

import styles from './task-form.module.css';

export default function TaskForm({
  visible = false,
  className = '',
  ref = null,
}: {
  visible: boolean;
  className?: string;
  ref?: RefObject<null> | null;
}) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      // await addTask({description});
    } catch (err) {
      console.error(err);
      setError('Failed to save task.');
    } finally {
      setIsSubmitting(false);
      toggleClientFormVisible();
    }
  };

  return (
    <form
      className={`${styles.form} ${className}`}
      ref={ref}
      onSubmit={handleSubmit}
    >
      <h2 className={`${styles.formTitle} secondary-header`}>Add task</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="form-item">
        <label className="form-label" htmlFor="task_description">
          Address
        </label>
        <textarea
          className="form-input"
          id="task_description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      <div className="form-item">
        <label className="form-label" htmlFor="task_value">
          Rate
        </label>
        <input
          className="form-input"
          type="number"
          id="task_value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>

      <div className={`${styles.formActions} form-item`}>
        <Button type="button" onClick={toggleClientFormVisible} style="inline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
