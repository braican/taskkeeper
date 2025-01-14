import { useState } from 'react';
import Button from '../button';
import styles from './invoice-form.module.css';
import { useNewInvoice } from '@/contexts/NewInvoiceContext';
import { moneyFormatter } from '@/utils';

export default function InvoiceForm({ onCancel }: { onCancel: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState();
  const { getCost, clearTasks } = useNewInvoice();

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }

    clearTasks();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('save invoice');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-row flex-fields">
        <span className={styles.invoiceCost}>
          {moneyFormatter.format(getCost())}
        </span>
      </div>
      <div className={`form-row ${styles.invoiceGrid}`}>
        <div className={styles.invoiceId}>
          <label className="form-label" htmlFor="invoice_id">
            Invoice ID
          </label>
          <input className="form-input" type="text" id="invoice_id" />
        </div>
        <div>
          <label className="form-label" htmlFor="invoice_issue_date">
            Issue Date
          </label>
          <input className="form-input" type="date" id="invoice_issue_date" />
        </div>
        <div>
          <label className="form-label" htmlFor="invoice_due_date">
            Due Date
          </label>
          <input className="form-input" type="date" id="invoice_due_date" />
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
        ></textarea>
      </div>

      <div className="form-row form-actions">
        <Button type="button" onClick={handleCancel} style="inline">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
