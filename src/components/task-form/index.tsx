import { useState } from 'react';
import SlideUpModalForm from '@/components/slide-up-modal-form';

export default function TaskForm({
  visible = false,
  setVisibility,
}: {
  visible: boolean;
  setVisibility: (setVisibility: boolean) => void;
}) {
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
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
      </>
    </SlideUpModalForm>
  );
}
