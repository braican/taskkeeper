import { useCallback, useEffect, useState, useRef } from 'react';
import sanitizeHtml from 'sanitize-html';
import { useTasks } from '@/contexts/TaskContext';
import { useNewInvoice } from '@/contexts/NewInvoiceContext';
import Button from '@/components/button';
import Toggle from '@/components/toggle';
import IconTrash from '@/icons/trash';
import IconCheckmark from '@/icons/checkmark';
import { moneyFormatter, taskCost } from '@/utils';
import { Task } from '@/types';
import styles from './task-item.module.css';

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
  const [price, setPrice] = useState(taskCost(task, rate));
  const [isHourly, setIsHourly] = useState(task.isHourly);
  const hoursInputRef = useRef<HTMLInputElement>(null);
  const costInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isHourly) {
      setPrice((hours || 0) * rate);
    }
  }, [hours, rate, isHourly]);

  useEffect(() => {
    if (!isInvoicing) {
      setIsSelected(false);
    }
  }, [isInvoicing]);

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

  const handleUnitToggle = async () => {
    const newIsHourly = !isHourly;
    setIsHourly(newIsHourly);

    const newTaskData = { ...task, isHourly: newIsHourly };

    if (newIsHourly) {
      newTaskData.hours = hours;
      newTaskData.price = null;
    } else {
      newTaskData.price = price;
      newTaskData.hours = null;
    }

    try {
      await triggerTaskSave(newTaskData);
      // eslint-disable-next-line
    } catch (error) {}
  };

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
    <div
      className={`${styles.task} ${isInvoicing ? styles.invoicingActive : ''}`}
    >
      <div>
        <p
          className={styles.description}
          contentEditable={!isSaving && !isInvoicing}
          onFocus={() => setStatusMessage('Editing...')}
          onBlur={onDescriptionBlur}
          dangerouslySetInnerHTML={{ __html: description }}
        />
      </div>

      <div
        className={`weight-extrabold ${styles.taskCost} ${!isHourly ? styles.taskCostHoverable : ''}`}
        ref={costInputRef}
      >
        <div className="align-right">{moneyFormatter.format(price || 0)}</div>

        {!isHourly && (
          <input
            type="number"
            defaultValue={price}
            className={styles.costInput}
            onFocus={() => setStatusMessage('Editing...')}
            disabled={isInvoicing}
            onBlur={onPriceBlur}
            onChange={(e) => {
              if (costInputRef.current) {
                costInputRef.current.style.width = `${e.currentTarget.value.toString().length + 3}ch`;
              }
            }}
          />
        )}
      </div>

      <div className={styles.costUnitControl}>
        <div className={styles.costToggle}>
          <Toggle
            disabled={isSaving || isInvoicing}
            id={`rate_toggle_indicator-${task.id}`}
            toggled={isHourly}
            onToggle={handleUnitToggle}
            onLabel="Hourly"
            offLabel="Fixed"
            size="small"
          />
        </div>

        {isHourly && (
          <p>
            <span className={`${styles.hoursLabel} fs--1 weight-semibold`}>
              hours:
            </span>
            <input
              ref={hoursInputRef}
              type="number"
              min="0"
              disabled={isSaving || isInvoicing}
              defaultValue={hours || 0}
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
        className={`align-right ${styles.alertCenter} ${statusMessage ? styles.hasStatusMessage : ''}`}
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
          <div className={`${styles.deleteOptions} mt-s`}>
            <Button onClick={() => setConfirmDelettion(false)} style="inline">
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              style="secondary"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
