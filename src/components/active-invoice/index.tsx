import { useState } from 'react';
import { Invoice } from '@/types';
import { moneyFormatter, dateFormatter } from '@/utils';
import styles from './active-invoice.module.css';
import Button from '@/components/button';
import IconChevronDown from '@/icons/chevron-down';

export default function ActiveInvoice({ invoice }: { invoice: Invoice }) {
  const [isExpanded, setIsExpanded] = useState(false);
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
      <p className={styles.total}>{moneyFormatter.format(invoiceTotal)}</p>
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
