import { useState, useEffect, useRef } from 'react';
import Button from '../button';
import styles from './invoice-form.module.css';
import { useInvoices } from '@/contexts/InvoiceContext';
import { useNewInvoice } from '@/contexts/NewInvoiceContext';
import { moneyFormatter, todaysDate } from '@/utils';
import { Client, Invoice, InvoicedTask } from '@/types';

export default function InvoiceForm({
  client,
  onCancel,
}: {
  client: Client;
  onCancel: () => void;
}) {
  const { getNextInvoiceNumber, addInvoice } = useInvoices();
  const { getCost, clearTasks, tasks, setIsInvoicing } = useNewInvoice();
  const [invoiceNumber, setInvoiceNumber] = useState<string | undefined>();
  const [issueDate, setIssueDate] = useState(todaysDate);
  const [dueDate, setDueDate] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetchedNextInvoiceNumber = useRef(false);

  useEffect(() => {
    const newDueDate = new Date(issueDate);
    newDueDate.setDate(newDueDate.getDate() + 30);
    setDueDate(newDueDate.toISOString().split('T')[0]);
  }, [issueDate]);

  useEffect(() => {
    if (hasFetchedNextInvoiceNumber.current) return;
    hasFetchedNextInvoiceNumber.current = true;

    (async () => {
      const nextInvoiceNumber = await getNextInvoiceNumber(client);
      setInvoiceNumber(nextInvoiceNumber);
    })();
  }, [getNextInvoiceNumber, client]);

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }

    clearTasks();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (tasks.length < 1) {
      setError('You must select at least one task to invoice.');
      return;
    }

    setIsSubmitting(true);

    const newInvoice: Omit<Invoice, 'id'> = {
      number: invoiceNumber || `${client.key}-0001`,
      status: 'active',
      issueDate,
      dueDate,
      description,
      client: client.id,
      tasks: tasks.map((task) => {
        const taskData: InvoicedTask = {
          id: task.id,
          description: task.description,
          cost: task.price ? task.price : (task.hours || 0) * client.rate,
        };

        if (task.hours) {
          taskData.hours = task.hours;
        }

        return taskData;
      }),
    };

    try {
      await addInvoice(newInvoice);
      setIsInvoicing(false);
      clearTasks();
    } catch (err) {
      console.error(err);
      setError('Failed to save the invoice.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row flex-fields">
        <span className={styles.invoiceCost}>
          {moneyFormatter.format(getCost())}
        </span>
      </div>
      <div className={`form-row ${styles.invoiceGrid}`}>
        <div className={styles.invoiceNumber}>
          <label className="form-label" htmlFor="invoice_id">
            Invoice ID
          </label>
          <input
            className="form-input"
            type="text"
            id="invoice_id"
            value={invoiceNumber || ''}
            disabled={typeof invoiceNumber === 'undefined'}
            onChange={(e) => setInvoiceNumber(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="invoice_issue_date">
            Issue Date
          </label>
          <input
            className="form-input"
            type="date"
            id="invoice_issue_date"
            value={issueDate}
            onChange={(e) => setIssueDate(e.target.value)}
          />
        </div>
        <div>
          <label className="form-label" htmlFor="invoice_due_date">
            Due Date
          </label>
          <input
            className="form-input"
            type="date"
            id="invoice_due_date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>
      <div className="form-row">
        <label className="form-label" htmlFor="invoice_description">
          Description
        </label>
        <textarea
          className="form-input"
          id="invoice_description"
          rows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
      </div>

      {error && <div className="form-error-message">{error}</div>}

      <div className="form-row form-actions">
        <Button type="button" onClick={handleCancel} style="inline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || tasks.length < 1}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
