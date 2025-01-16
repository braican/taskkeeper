import { Invoice } from '@/types';
import ActiveInvoice from '@/components/active-invoice';

import styles from './invoice-list.module.css';

export default function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  if (invoices.length < 1) {
    return;
  }

  return (
    <ul className={`ul-reset ${styles.invoiceGrid}`}>
      {invoices.map((invoice) => (
        <li key={invoice.id}>
          <ActiveInvoice invoice={invoice} />
        </li>
      ))}
    </ul>
  );
}
