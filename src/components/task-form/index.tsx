import { useState } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { useCategories } from '@/contexts/CategoryContext';
import SlideUpModalForm from '@/components/slide-up-modal-form';
import Toggle from '@/components/toggle';
import CategoryPicker from '@/components/category-picker';
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
  const { categories, getOrCreateCategory } = useCategories();
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [isHourly, setIsHourly] = useState(true);
  const [date, setDate] = useState('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [prevVisible, setPrevVisible] = useState(visible);

  if (prevVisible !== visible) {
    setPrevVisible(visible);
    if (!visible) {
      setDescription('');
      setValue('');
      setIsHourly(true);
      setDate('');
      setCategoryIds([]);
      setError('');
    }
  }

  const handleAddCategory = async (name: string) => {
    const category = await getOrCreateCategory(name);
    if (category && !categoryIds.includes(category.id)) {
      setCategoryIds([...categoryIds, category.id]);
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    setCategoryIds(categoryIds.filter((id) => id !== categoryId));
  };

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

      if (date) {
        task.date = date;
      }

      if (categoryIds.length) {
        task.categories = categoryIds;
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

        <div className={`form-row flex-fields ${styles.metaRow}`}>
          <div className={styles.metaField}>
            <label className="form-label" htmlFor="task_date">
              Date
            </label>
            <input
              className="form-input"
              type="date"
              id="task_date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className={styles.metaField}>
            <label className="form-label" htmlFor="task_category">
              Categories
            </label>
            <CategoryPicker
              id="task_category"
              selectedIds={categoryIds}
              categories={categories}
              onAdd={handleAddCategory}
              onRemove={handleRemoveCategory}
            />
          </div>
        </div>
      </>
    </SlideUpModalForm>
  );
}
