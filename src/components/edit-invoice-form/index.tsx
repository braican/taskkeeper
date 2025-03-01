import { useState, useCallback } from 'react';
import { useClients } from '@/contexts/ClientContext';
import { useInvoices } from '@/contexts/InvoiceContext';
import SlideUpModalForm from '@/components/slide-up-modal-form';
import InvoiceTaskItem from '@/components/invoice-task-item';
import Collapsible from '@/components/collapsible';
import Button from '@/components/button';
import IconPlus from '@/icons/plus';
import { invoiceCost } from '@/utils';
import { Invoice, InvoicedTask } from '@/types';
import styles from './edit-invoice-form.module.css';

export default function EditInvoiceForm({
  invoice,
  isEditing = false,
  onCancel = () => {},
}: {
  invoice: Invoice;
  isEditing: boolean;
  onCancel: () => void;
}) {
  const { getClientById } = useClients();
  const { updateInvoice } = useInvoices();
  const [invoiceNumber, setInvoiceNumber] = useState(invoice.number);
  const [issueDate, setIssueDate] = useState(
    invoice.issueDate.substring(0, 10),
  );
  const [dueDate, setDueDate] = useState(invoice.dueDate.substring(0, 10));
  const [description, setDescription] = useState(invoice.description);
  const [tasks, setTasks] = useState(invoice.tasks);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rate = getClientById(invoice.client)?.rate || 0;

  const handleTaskUpdate = useCallback((updatedTask: InvoicedTask) => {
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
        isHourly: true,
        hours: 0,
        cost: 0,
      },
    ]);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  };

  const handleEdit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const newData: Invoice = {
        ...invoice,
        number: invoiceNumber,
        issueDate,
        dueDate,
        description,
        tasks,
      };

      await updateInvoice(newData);

      if (typeof onCancel === 'function') {
        onCancel();
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update invoice.');
    } finally {
      setIsSubmitting(false);
    }
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
        <div className={`form-row align-right`}>
          <p>${rate}/hour</p>
          <p className="weight-bold fs-2">{invoiceCost(tasks)}</p>
        </div>

        <Collapsible label="Tasks">
          <>
            <div className="form-row">
              <ul className="ul-reset">
                {tasks.map((task) => (
                  <li key={task.id}>
                    <InvoiceTaskItem
                      rate={rate}
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
        </Collapsible>
      </>
    </SlideUpModalForm>
  );
}
