import { useEffect, useState } from 'react';
import { dateFormatter, invoiceCost } from '@/utils';
import { useInvoices } from '@/contexts/InvoiceContext';
import Button from '@/components//button';
import { Client, Invoice } from '@/types';

import styles from './paid-invoices.module.css';

export default function PaidInvoices({
  invoices = [],
  client,
}: {
  invoices: Invoice[];
  client: Client;
}) {
  const { fetchAllPaidClientInvoices } = useInvoices();
  const [isFetching, setIsFetching] = useState(false);
  const [hasFetchedAll, setHasFetchedAll] = useState(false);
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

  const fetchMoreInvoices = async () => {
    if (!client) {
      return;
    }

    setIsFetching(true);
    const newInvoices = await fetchAllPaidClientInvoices(client.id);
    setOrganizedInvoices(organizeInvoices(newInvoices));
    setIsFetching(false);
    setHasFetchedAll(true);
  };

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
                    <div>
                      <p>
                        <span className="weight-semibold">
                          {invoice.number}
                        </span>
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
                    <p className={`${styles.invoiceCost} weight-bold`}>
                      {invoiceCost(invoice.tasks)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={styles.invoice}>No paid invoices in {group.year}</p>
            )}
          </li>
        ))}
      </ul>

      {!hasFetchedAll && (
        <Button
          style="outlined"
          size="small"
          onClick={fetchMoreInvoices}
          disabled={isFetching}
        >
          {isFetching ? 'Fetching all invoices...' : 'More paid invoices'}
        </Button>
      )}
    </div>
  );
}
