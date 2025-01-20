import { dateFormatter, invoiceCost } from '@/utils';

export default function PaidInvoices() {
  return <p>invoices</p>;
  // if (!areInvoicedLoaded) {
  //   return <p>Loading...</p>;
  // }

  // if (paidInvoices.length < 1) {
  //   return <p>No past invoices.</p>;
  // }

  // return (
  //   <div>
  //     <ul className="ul-reset">
  //       {paidInvoices.map((invoice) => (
  //         <li key={invoice.id}>
  //           <p>{invoice.number}</p>
  //           <p>{dateFormatter(invoice.paidDate || '')}</p>
  //           <p>{invoiceCost(invoice.tasks)}</p>
  //         </li>
  //       ))}
  //     </ul>
  //   </div>
  // );
}
