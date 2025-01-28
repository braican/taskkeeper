import Link from 'next/link';
import { dateFormatter, invoiceCost } from '@/utils';
import { Invoice } from '@/types';

import styles from './active-invoice-list.module.css';

export default function ActiveInvoiceList({
  invoices = [],
  headline = '',
  className = '',
  type = 'pending',
}: {
  invoices: Invoice[];
  headline?: string;
  className?: string;
  type?: 'pending' | 'sent';
}) {
  return (
    <div className={className}>
      {headline && <h3 className="uppercase-header">{headline}</h3>}

      <ul className="ul-reset">
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            <Link
              className={`${styles.invoice} ${type === 'sent' ? styles.invoiceSent : styles.invoicePending}`}
              href={invoice.client ? `/client/${invoice.client}` : '#'}
            >
              <p>{invoice.number}</p>
              <p className="weight-extrabold">{invoiceCost(invoice.tasks)}</p>
              <p className={styles.invoiceDate}>
                <span className="uppercase-header">
                  {type === 'sent' ? 'Due on' : 'Send on'}
                </span>{' '}
                {dateFormatter(
                  type === 'sent' ? invoice.dueDate : invoice.issueDate,
                  'numeric',
                )}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
