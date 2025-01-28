import { dateFormatter, invoiceCost } from '@/utils';
import { Invoice } from '@/types';
import styles from './paid-invoice.module.css';

export default function PaidInvoice({ invoice }: { invoice: Invoice }) {
  return (
    <>
      <div>
        <p>
          <span className="weight-semibold">{invoice.number}</span>
          {invoice.description && (
            <span>&nbsp;&ndash;&nbsp;{invoice.description}</span>
          )}
        </p>
        <p>
          <span>
            <span className="uppercase-header">Issued: </span>
            {dateFormatter(invoice.issueDate || '', 'numeric')}
          </span>
          &nbsp;&nbsp;
          <span>
            <span className="uppercase-header">Paid: </span>
            {dateFormatter(invoice.paidDate || '', 'numeric')}
          </span>
        </p>
      </div>
      <div className={styles.invoiceCost}>
        {invoice.rate && (
          <p className={styles.invoiceRate}>${invoice.rate}/hour</p>
        )}
        <p className={`${styles.invoiceTotal} weight-bold`}>
          {invoiceCost(invoice.tasks)}
        </p>
      </div>
    </>
  );
}
