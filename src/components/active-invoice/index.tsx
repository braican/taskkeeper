import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Invoice } from '@/types';
import {
  moneyFormatter,
  dateFormatter,
  dateFormatterFilename,
  todaysDate,
  invoiceCost,
} from '@/utils';
import { useClients } from '@/contexts/ClientContext';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoices } from '@/contexts/InvoiceContext';
import Button from '@/components/button';
import InvoicePdf from '@/components/invoice-pdf';
import IconChevronDown from '@/icons/chevron-down';
import IconDownload from '@/icons/download';
import styles from './active-invoice.module.css';

export default function ActiveInvoice({ invoice }: { invoice: Invoice }) {
  const { getClientById } = useClients();
  const { setInvoicePaid } = useInvoices();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSetPaidConfirmation, setIsPaidConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [paidDate, setPaidDate] = useState(todaysDate);
  const client = getClientById(invoice.client);

  const issueDate = new Date(invoice.issueDate);
  const today = new Date();
  const isPending = issueDate >= today;

  const handlePaid = async () => {
    setIsSaving(true);

    try {
      await setInvoicePaid(invoice.id, paidDate);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelPaid = () => {
    setIsPaidConfirmation(false);
    setPaidDate(todaysDate);
  };

  return (
    <div
      className={`${styles.invoice} ${isPending ? styles.invoicePending : ''}`}
    >
      <div>
        <p className={styles.number}>{invoice.number}</p>
        {!isPending && (
          <p>
            <span className="uppercase-header">Issued</span>{' '}
            {dateFormatter(invoice.issueDate)}
          </p>
        )}
        <p>
          <span className="uppercase-header">Due</span>{' '}
          {dateFormatter(invoice.dueDate)}
        </p>
      </div>
      <div>
        <p className={styles.total}>{invoiceCost(invoice.tasks)}</p>
        {client && user?.email === 'nick.braica@gmail.com' && (
          <Button onClick={() => {}} style="inline" icon={IconDownload}>
            <PDFDownloadLink
              document={<InvoicePdf invoice={invoice} client={client} />}
              fileName={`invoice-${invoice.number.toLowerCase()}-${dateFormatterFilename(invoice.issueDate)}.pdf`}
            >
              Download
            </PDFDownloadLink>
          </Button>
        )}
      </div>

      {isExpanded && (
        <div className={styles.details}>
          {invoice.description && (
            <>
              <p className="uppercase-header">Description</p>
              <p className={styles.description}>{invoice.description}</p>
            </>
          )}
          <p className="uppercase-header">Tasks</p>
          <ul className={`ul-reset ${styles.taskList}`}>
            {invoice.tasks.map((task) => (
              <li key={task.description} className={styles.taskItem}>
                <p className={styles.taskDescription}>{task.description}</p>
                <p>{task.hours ? `${task.hours} hrs` : ''}</p>
                <p className={styles.taskCost}>
                  {moneyFormatter.format(task.cost)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        className={`${styles.action} ${isPending ? styles.actionToIssue : ''}`}
      >
        {isSetPaidConfirmation ? (
          <>
            <div className={styles.paidDateInput}>
              <label
                className={`form-label ${styles.paidDateLabel}`}
                htmlFor="invoice_paid_date"
              >
                Paid Date
              </label>
              <input
                className="form-input outlined"
                type="date"
                id="invoice_paid_date"
                value={paidDate}
                onChange={(e) => setPaidDate(e.target.value)}
              />
            </div>
            <div className={styles.paidButtons}>
              <Button
                className={styles.payButton}
                size="small"
                onClick={handlePaid}
                disabled={isSaving}
              >
                {isSaving ? 'Paying...' : 'Paid'}
              </Button>
              {!isSaving && (
                <Button
                  className={styles.cancelPaid}
                  size="small"
                  onClick={handleCancelPaid}
                  style="inline"
                >
                  Cancel
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            {isPending ? (
              <p className={styles.toIssueWarning}>
                To issue on {dateFormatter(invoice.issueDate)}
              </p>
            ) : (
              <Button
                className={styles.payButton}
                size="small"
                onClick={() => setIsPaidConfirmation(true)}
              >
                Mark as paid
              </Button>
            )}
            <Button
              icon={IconChevronDown}
              className={`${styles.collapser} ${isExpanded ? styles.flipCollapser : ''}`}
              iconOnly
              style={isPending ? 'secondary' : 'primary'}
              size="small"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Collapse invoice' : 'Expand invoice'}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
