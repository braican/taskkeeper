import { useCallback, useEffect, useState, useRef } from 'react';
import sanitizeHtml from 'sanitize-html';
import { useTasks } from '@/contexts/TaskContext';
import { useNewInvoice } from '@/contexts/NewInvoiceContext';
import Button from '@/components/button';
import IconTrash from '@/icons/trash';
import IconCheckmark from '@/icons/checkmark';
import { Task } from '@/types';
import styles from './task-item.module.css';
import { moneyFormatter } from '@/utils';

export default function TaskItem({ task, rate }: { task: Task; rate: number }) {
  const { isInvoicing, addTask, removeTask } = useNewInvoice();
  const { updateTask, deleteTask } = useTasks();
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirmingDeletion, setConfirmDelettion] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [description, setDescription] = useState(task.description);
  const [hours, setHours] = useState(task.hours);
  const [price, setPrice] = useState(
    (task.price || 0) > 0 ? task.price : (task.hours || 0) * rate,
  );
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const costInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (hours && hours > 0) {
      setPrice(hours * rate);
    }
  }, [hours, rate]);

  const triggerTaskSave = useCallback(
    async (newTask: Task) => {
      setStatusMessage('Saving...');
      setIsSaving(true);

      try {
        await updateTask(newTask);
      } catch (error) {
        console.error('There was a problem updating the task:', error);
        throw error;
      } finally {
        setIsSaving(false);
        setStatusMessage('');
      }
    },
    [updateTask],
  );

  const onDescriptionBlur = useCallback(
    async (e: React.FocusEvent) => {
      const oldDEscription = description;
      const newDescription = e.currentTarget.innerHTML;

      if (oldDEscription === newDescription) {
        setStatusMessage('');
        return;
      }

      setDescription(
        sanitizeHtml(newDescription, {
          allowedTags: [],
          allowedAttributes: {},
        }),
      );

      try {
        await triggerTaskSave({ ...task, description: newDescription });
        // eslint-disable-next-line
      } catch (error) {
        setDescription(oldDEscription);
      }
    },
    [description, task, triggerTaskSave],
  );

  const onHoursBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
      const oldHours = hours;
      const newHours = Number(e.currentTarget.value);

      if (oldHours === newHours || isNaN(newHours)) {
        setStatusMessage('');
        return;
      }

      setHours(newHours);
      try {
        await triggerTaskSave({ ...task, hours: newHours });
        // eslint-disable-next-line
      } catch (error) {
        setHours(oldHours);
      }
    },
    [hours, task, triggerTaskSave],
  );

  const onPriceBlur = useCallback(
    async (e: React.FocusEvent<HTMLInputElement>) => {
      const oldPrice = price;
      const newPrice = Number(e.currentTarget.value);

      if (costInputRef.current) {
        costInputRef.current.style.width = '';
      }

      if (oldPrice === newPrice || isNaN(newPrice)) {
        setStatusMessage('');
        return;
      }

      setPrice(newPrice);
      try {
        await triggerTaskSave({ ...task, price: newPrice });
        // eslint-disable-next-line
      } catch (error) {
        setPrice(oldPrice);
      }
    },
    [price, task, triggerTaskSave],
  );

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      // eslint-disable-next-line
    } catch (error) {}
  };

  const handleSelectForInvoice = () => {
    if (isSelected) {
      removeTask(task.id);
    } else {
      addTask(task);
    }

    setIsSelected(!isSelected);
  };

  return (
    <div className={styles.task}>
      <div className={styles.descriptionCell}>
        <p
          className={styles.description}
          contentEditable={!isSaving}
          onFocus={() => setStatusMessage('Editing...')}
          onBlur={onDescriptionBlur}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      <p
        className={`${styles.taskCost} ${(task.price || 0) > 0 ? styles.taskCostHoverable : ''}`}
        ref={costInputRef}
      >
        <span className={styles.costDisplay}>
          {moneyFormatter.format(price || 0)}
        </span>

        {(task.price || 0) > 0 && (
          <input
            type="number"
            defaultValue={price}
            className={styles.costInput}
            onFocus={() => setStatusMessage('Editing...')}
            onBlur={onPriceBlur}
            onChange={(e) => {
              if (costInputRef.current) {
                costInputRef.current.style.width = `${e.currentTarget.value.toString().length + 3}ch`;
              }
            }}
          />
        )}
      </p>

      <div>
        {!task.price && (
          <p>
            <span className={styles.hoursLabel}>hours:</span>
            <input
              ref={hoursInputRef}
              type="number"
              defaultValue={hours}
              className={styles.hours}
              style={{ width: `${(hours || 0)?.toString().length + 5}ch` }}
              onFocus={() => setStatusMessage('Editing...')}
              onChange={(e) => {
                if (hoursInputRef.current) {
                  hoursInputRef.current.style.width = `${e.currentTarget.value.toString().length + 5}ch`;
                }
              }}
              onBlur={onHoursBlur}
            />
          </p>
        )}
      </div>

      <div
        className={`${styles.alertCenter} ${statusMessage ? styles.hasStatusMessage : ''}`}
      >
        {statusMessage && (
          <p className={styles.statusMessage}>{statusMessage}</p>
        )}

        <div className={styles.actions}>
          {isInvoicing ? (
            <Button
              icon={isSelected ? IconCheckmark : null}
              onClick={handleSelectForInvoice}
              style={isSelected ? 'primary' : 'outlined'}
              size="small"
              className={styles.invoiceButton}
            >
              {isSelected ? 'Added to invoice' : 'Add to invoice'}
            </Button>
          ) : (
            <Button
              icon={IconTrash}
              style="secondary"
              iconOnly
              onClick={() => setConfirmDelettion(true)}
            >
              Delete
            </Button>
          )}
        </div>
      </div>

      {isConfirmingDeletion && (
        <div className={styles.deleteModal}>
          <p>Do you really want to delete this task?</p>
          <div className={styles.deleteOptions}>
            <Button onClick={() => setConfirmDelettion(false)} style="inline">
              Cancel
            </Button>
            <Button onClick={handleDelete} style="secondary">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
