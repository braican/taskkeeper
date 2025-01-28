import { useState, useEffect } from 'react';
import Toggle from '@/components/toggle';
import Button from '@/components/button';
import IconTrash from '@/icons/trash';
import { InvoicedTask } from '@/types';
import styles from './invoice-task-item.module.css';

export default function EditInvoiceTask({
  id,
  task,
  rate,
  onUpdate,
  onDelete,
}: {
  id: string;
  task: InvoicedTask;
  rate: number;
  onUpdate: (updatedTask: InvoicedTask) => void;
  onDelete: (id: string) => void;
}) {
  const [description, setDescription] = useState(task.description);
  const [value, setValue] = useState(
    task.isHourly ? task.hours || 0 : task.cost,
  );
  const [isHourly, setIsHourly] = useState(task.isHourly);
  const [isConfirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const newTaskData: InvoicedTask = {
      id,
      description,
      isHourly,
      cost: isHourly ? value * rate : value,
    };

    if (isHourly) {
      newTaskData.hours = value;
    }

    onUpdate(newTaskData);
  }, [onUpdate, id, description, value, isHourly, rate]);

  return (
    <div className={styles.task}>
      <div
        className={`${styles.taskData} ${isConfirmDelete ? styles.hideTaskData : ''}`}
      >
        <label className={styles.description}>
          <span className="form-label">Description</span>
          <textarea
            className={`form-input ${styles.descriptionInput}`}
            rows={2}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </label>

        <div className={styles.toggle}>
          <Toggle
            id={`rate_toggle_indicator-${task.id}`}
            toggled={isHourly}
            onToggle={() => setIsHourly(!isHourly)}
            onLabel="Hourly"
            offLabel="Fixed"
            size="small"
          />
        </div>

        <label className={styles.costValue}>
          <span className="form-label">{isHourly ? 'Hours' : 'Cost'}</span>
          <input
            className={`form-input ${styles.numberInput}`}
            type="number"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value))}
          />
        </label>

        <div className={styles.actions}>
          <Button
            icon={IconTrash}
            style="secondary"
            iconOnly
            onClick={() => setConfirmDelete(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      {isConfirmDelete && (
        <div className={styles.confirmDelete}>
          <p>Do you really want to delete this task?</p>
          <div className={styles.deleteOptions}>
            <Button onClick={() => setConfirmDelete(false)} style="inline">
              Cancel
            </Button>
            <Button onClick={() => onDelete(id)} style="secondary">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
