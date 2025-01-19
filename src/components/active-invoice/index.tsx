import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Invoice } from '@/types';
import { moneyFormatter, dateFormatter, dateFormatterFilename } from '@/utils';
import { useClients } from '@/contexts/ClientContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/button';
import InvoicePdf from '@/components/invoice-pdf';
import IconChevronDown from '@/icons/chevron-down';
import IconDownload from '@/icons/download';
import styles from './active-invoice.module.css';

export default function ActiveInvoice({ invoice }: { invoice: Invoice }) {
  const { getClientById } = useClients();
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const client = getClientById(invoice.client);
  const invoiceTotal = invoice.tasks.reduce(
    (total, task) => total + task.cost,
    0,
  );

  return (
    <div className={styles.invoice}>
      <div>
        <p className={styles.number}>{invoice.number}</p>
        <p>
          <span className="uppercase-header">Issued</span>{' '}
          {dateFormatter(invoice.issueDate)}
        </p>
        <p>
          <span className="uppercase-header">Due</span>{' '}
          {dateFormatter(invoice.dueDate)}
        </p>
      </div>
      <div>
        <p className={styles.total}>{moneyFormatter.format(invoiceTotal)}</p>
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

      <p className={styles.action}>
        <Button className={styles.payButton} size="small">
          Mark as paid
        </Button>
        <Button
          icon={IconChevronDown}
          className={`${styles.collapser} ${isExpanded ? styles.flipCollapser : ''}`}
          iconOnly
          size="small"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse invoice' : 'Expand invoice'}
        </Button>
      </p>

      {isExpanded && (
        <div className={styles.tasks}>
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
    </div>
  );
}
