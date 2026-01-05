import { useEffect, useState } from 'react';
import { useInvoices } from '@/contexts/InvoiceContext';
import Button from '@/components//button';
import PaidInvoice from '@/components/paid-invoice';
import { Client, Invoice } from '@/types';

import styles from './paid-invoice-list.module.css';
import { invoiceCost, moneyFormatter } from '@/utils';

export default function PaidInvoiceList({
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
    { year: string; invoices: Invoice[]; total: number }[]
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
      total: groupedInvoices[year].reduce(
        (sum, inv) => sum + Number(invoiceCost(inv.tasks, false)),
        0,
      ),
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
      <ul className={`ul-reset mb-m ${styles.invoiceList}`}>
        {organizedInvoices.map((group) => (
          <li key={group.year} className="mt-s">
            <header className={styles.groupHeader}>
              <h3>{group.year}</h3>
              <span>{moneyFormatter.format(group.total)}</span>
            </header>

            {group.invoices.length > 0 ? (
              <ul className="ul-reset">
                {group.invoices.map((invoice) => (
                  <li key={invoice.id}>
                    <PaidInvoice invoice={invoice} />
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
