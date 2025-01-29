import { useState } from 'react';
import Button from '@/components/button';
import { dateFormatter, invoiceCost, moneyFormatter } from '@/utils';
import IconChevronDown from '@/icons/chevron-down';
import { Invoice } from '@/types';
import styles from './paid-invoice.module.css';

export default function PaidInvoice({ invoice }: { invoice: Invoice }) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className={styles.invoice}>
      <Button
        icon={IconChevronDown}
        iconOnly
        style="inline"
        size="xsmall"
        className={`${styles.expander} ${isExpanded ? styles.flipExpander : ''}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        Open tasks
      </Button>
      <div className={styles.description}>
        <p>
          <span className="weight-semibold">{invoice.number}</span>
          {invoice.description && (
            <span>&nbsp;&ndash;&nbsp;{invoice.description}</span>
          )}
        </p>
        <div className={styles.dates}>
          <p>
            <span className="uppercase-header">Issued: </span>
            {dateFormatter(invoice.issueDate || '', 'numeric')}
          </p>

          <p>
            <span className="uppercase-header">Paid: </span>
            {dateFormatter(invoice.paidDate || '', 'numeric')}
          </p>
        </div>
      </div>
      <div className={styles.cost}>
        {invoice.rate && <p className="fs--1">${invoice.rate}/hour</p>}
        <p className={`weight-bold`}>{invoiceCost(invoice.tasks)}</p>
      </div>
      {isExpanded && (
        <div className={styles.taskList}>
          <ul className="ul-reset">
            {invoice.tasks.map((task) => (
              <li key={task.description} className={styles.taskItem}>
                <p className={styles.taskDescription}>{task.description}</p>
                <p>{task.hours ? `${task.hours} hrs` : ''}</p>
                <p className="align-right">
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
