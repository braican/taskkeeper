import { useEffect, useState } from 'react';
import { dateFormatter, invoiceCost } from '@/utils';
import Button from '@/components//button';
import { Invoice } from '@/types';

import styles from './paid-invoices.module.css';

export default function PaidInvoices({
  invoices = [],
}: {
  invoices: Invoice[];
}) {
  const [organizedInvoices, setOrganizedInvoices] = useState<
    { year: string; invoices: Invoice[] }[]
  >([]);

  const organizeInvoices = (invoices: Invoice[] = []) => {
    // Always list the current year.
    const defaultGrouping = { [new Date().getFullYear()]: [] };
    const groupedInvoices = invoices.reduce(
      (acc, invoice) => {
        const year = new Date(invoice.paidDate || '').getFullYear();
        if (!acc[year]) {
          acc[year] = [];
        }
        acc[year].push(invoice);
        return acc;
      },
      defaultGrouping as Record<string, Invoice[]>,
    );

    const organizedArray = Object.keys(groupedInvoices).map((year) => ({
      year: year,
      invoices: groupedInvoices[year],
    }));

    organizedArray.sort((a, b) => Number(b.year) - Number(a.year));

    return organizedArray;
  };

  useEffect(() => {
    setOrganizedInvoices(organizeInvoices(invoices));
  }, [invoices]);

  const fetchMoreInvoices = () => {};

  return (
    <div>
      <ul className={`ul-reset ${styles.invoiceList}`}>
        {organizedInvoices.map((group) => (
          <li key={group.year} className={styles.year}>
            <h3 className={styles.yearLabel}>{group.year}</h3>

            {group.invoices.length > 0 ? (
              <ul className="ul-reset">
                {group.invoices.map((invoice) => (
                  <li key={invoice.id} className={styles.invoice}>
                    <p>{invoice.number}</p>
                    <div>
                      <p>
                        <span className="uppercase-header">Issued: </span>
                        {dateFormatter(invoice.issueDate || '', 'numeric')}
                      </p>
                      <p>
                        <span className="uppercase-header">Paid: </span>
                        {dateFormatter(invoice.paidDate || '', 'numeric')}
                      </p>
                    </div>
                    <p className={styles.invoiceCost}>
                      {invoiceCost(invoice.tasks)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.invoice}>No invoices in {group.year}</p>
            )}
          </li>
        ))}
      </ul>

      <Button style="outlined" size="small" onClick={fetchMoreInvoices}>
        More paid invoices
      </Button>
    </div>
  );
}
