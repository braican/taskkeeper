import { Invoice } from '@/types';
import { useInvoices } from '@/contexts/InvoiceContext';
import ActiveInvoice from '@/components/active-invoice';

import styles from './invoice-list.module.css';

export default function InvoiceList({ invoices }: { invoices: Invoice[] }) {
  const { getActiveInvoices } = useInvoices();

  if (invoices.length < 1) {
    return;
  }

  const { pending, sent } = getActiveInvoices(invoices);

  return (
    <>
      {pending.length > 0 && (
        <div>
          <h3 className="uppercase-header">Pending</h3>
          <ul className={`ul-reset ${styles.invoiceGrid}`}>
            {pending.map((invoice) => (
              <li key={invoice.id}>
                <ActiveInvoice invoice={invoice} />
              </li>
            ))}
          </ul>
        </div>
      )}
      {sent.length > 0 && (
        <div>
          <h3 className="uppercase-header">Sent</h3>
          <ul className={`ul-reset ${styles.invoiceGrid}`}>
            {sent.map((invoice) => (
              <li key={invoice.id}>
                <ActiveInvoice invoice={invoice} />
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
