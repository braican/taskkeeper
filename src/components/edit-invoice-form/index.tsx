import { useState, useEffect, useCallback } from 'react';
import SlideUpModalForm from '@/components//slide-up-modal-form';
import Button from '@/components/button';
import IconTrash from '@/icons/trash';
import IconPlus from '@/icons/plus';
import { Invoice, InvoicedTask } from '@/types';
import styles from './edit-invoice-form.module.css';

function EditInvoiceTask({
  task,
  id,
  onUpdate,
  onDelete,
}: {
  task: InvoicedTask;
  id: string;
  onUpdate: (updatedTask: InvoicedTask) => void;
  onDelete: (id: string) => void;
}) {
  const [description, setDescription] = useState(task.description);
  const [hours, setHours] = useState(task.hours);
  const [cost, setCost] = useState(task.cost);
  const [isConfirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    onUpdate({ id, description, hours, cost });
  }, [onUpdate, id, description, hours, cost]);

  return (
    <div className={styles.editSingleTask}>
      <div
        className={`${styles.editTask} ${isConfirmDelete ? styles.hideMain : ''}`}
      >
        <label className={styles.descriptionValue}>
          <span className="form-label">Description</span>
          <textarea
            className="form-input"
            rows={2}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </label>

        <div className={styles.utils}>
          <label className={styles.numberValue}>
            <span className="form-label">{hours ? 'Hours' : 'Cost'}</span>
            <input
              className={`form-input ${styles.numberInput}`}
              type="number"
              value={hours ? hours : cost}
              onChange={(e) => {
                const value = parseFloat(e.target.value);

                if (hours) {
                  setHours(value);
                } else {
                  setCost(value);
                }
              }}
            />
          </label>

          <div className={styles.actions}>
            <span className={`form-label ${styles.placeholderActionLabel}`}>
              &nbsp;
            </span>
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

export default function EditInvoiceForm({
  invoice,
  isEditing = false,
  onCancel = () => {},
}: {
  invoice: Invoice;
  isEditing: boolean;
  onCancel: () => void;
}) {
  const [invoiceNumber, setInvoiceNumber] = useState(invoice.number);
  const [issueDate, setIssueDate] = useState(
    invoice.issueDate.substring(0, 10),
  );
  const [dueDate, setDueDate] = useState(invoice.dueDate.substring(0, 10));
  const [description, setDescription] = useState(invoice.description);
  const [tasks, setTasks] = useState(invoice.tasks);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTaskUpdate = useCallback((updatedTask: InvoicedTask) => {
    console.log(updatedTask);

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === updatedTask.id ? updatedTask : task,
      ),
    );
  }, []);

  const handleAddNewTask = () => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: `newTask-${prevTasks.length + 1}`,
        description: '',
        hours: 0,
        cost: 0,
      },
    ]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleEdit = async () => {
    console.log(tasks);
  };

  return (
    <SlideUpModalForm
      visible={isEditing}
      title={`Edit invoice ${invoice.number}`}
      onSubmit={handleEdit}
      onCancel={onCancel}
    >
      <>
        {error && <div className="form-error-message">{error}</div>}

        <div className="form-row">
          <label className="form-label" htmlFor="edit_invoice_number">
            Invoice ID
          </label>
          <input
            className="form-input"
            type="text"
            id="edit_invoice_number"
            value={invoiceNumber}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div className={`${styles.dateFields} form-row`}>
          <div>
            <label className="form-label" htmlFor="edit_invoice_issue_date">
              Issue Date
            </label>
            <input
              className="form-input"
              type="date"
              id="edit_invoice_issue_date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="edit_invoice_due_date">
              Due Date
            </label>
            <input
              className="form-input"
              type="date"
              id="edit_invoice_due_date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="edit_invoice_description">
            Description
          </label>
          <textarea
            className="form-input"
            id="edit_invoice_description"
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="form-row">
          <span className={`${styles.tasksLabel} uppercase-header`}>Tasks</span>
          <ul className="ul-reset">
            {tasks.map((task) => (
              <li key={task.id}>
                <EditInvoiceTask
                  task={task}
                  onUpdate={handleTaskUpdate}
                  onDelete={handleDeleteTask}
                  id={task.id}
                />
              </li>
            ))}
          </ul>
        </div>

        <div className="form-row">
          <Button
            disabled={isSubmitting}
            size="small"
            style="secondary"
            onClick={handleAddNewTask}
            icon={IconPlus}
          >
            Add task
          </Button>
        </div>
      </>
    </SlideUpModalForm>
  );
}
