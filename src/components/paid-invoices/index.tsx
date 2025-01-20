import { dateFormatter, invoiceCost } from '@/utils';
import { Invoice } from '@/types';

export default function PaidInvoices({
  invoices = [],
}: {
  invoices: Invoice[];
}) {
  if (invoices.length < 1) {
    return <p>No paid invoices.</p>;
  }

  return (
    <div>
      <ul className="ul-reset">
        {invoices.map((invoice) => (
          <li key={invoice.id}>
            <p>{invoice.number}</p>
            <p>{dateFormatter(invoice.paidDate || '')}</p>
            <p>{invoiceCost(invoice.tasks)}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
