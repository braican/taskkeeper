import { useTasks } from '@/contexts/TaskContext';
import { useInvoices } from '@/contexts/InvoiceContext';
import { useClients } from '@/contexts/ClientContext';
import { invoiceCost, moneyFormatter, taskCost } from '@/utils';

import styles from './stats.module.css';

export default function Stats() {
  const { getClientById, areClientsLoaded } = useClients();
  const { tasks } = useTasks();
  const { invoices } = useInvoices();
  const currentYear = new Date().getFullYear();
  const lastYear = currentYear - 1;

  const estimated = tasks.reduce((acc, task) => {
    const taskClient = getClientById(task.client);
    return acc + taskCost(task, taskClient?.rate || 0);
  }, 0);

  const { pending, waiting, paid, paidLastYear, total } = invoices.reduce(
    (acc, invoice) => {
      const date = invoice.paidDate || invoice.issueDate;
      const year = new Date(date).getFullYear();
      const cost = Number(invoiceCost(invoice.tasks, false));

      if (year === lastYear && invoice.status === 'paid') {
        acc.paidLastYear += cost;
      } else if (year === currentYear || !invoice.paidDate) {
        acc.total += cost;
        if (invoice.status === 'paid') {
          acc.paid += cost;
        } else {
          const issueDate = new Date(invoice.issueDate);
          const today = new Date();
          if (issueDate > today) {
            acc.pending += cost;
          } else {
            acc.waiting += cost;
          }
        }
      }

      return acc;
    },
    {
      pending: 0,
      waiting: 0,
      paid: 0,
      paidLastYear: 0,
      total: 0,
    },
  );

  return (
    <div>
      <section className={styles.section}>
        <header className={styles.totals}>
          <h3>{currentYear}</h3>
          <span>{moneyFormatter.format(total + estimated)}</span>
        </header>
        <dl className={styles.statList}>
          <dt className="uppercase-header">Estimated:</dt>
          <dd className={areClientsLoaded ? '' : styles.placeholder}>
            <span>{moneyFormatter.format(estimated)}</span>
          </dd>
          <dt className="uppercase-header">Pending invoice:</dt>
          <dd className={areClientsLoaded ? '' : styles.placeholder}>
            <span>{moneyFormatter.format(pending)}</span>
          </dd>
          <dt className="uppercase-header">Awaiting payment:</dt>
          <dd className={areClientsLoaded ? '' : styles.placeholder}>
            <span>{moneyFormatter.format(waiting)}</span>
          </dd>
          <dt className="uppercase-header">Paid:</dt>
          <dd className={areClientsLoaded ? '' : styles.placeholder}>
            <span>{moneyFormatter.format(paid)}</span>
          </dd>
        </dl>
      </section>
      <section className={styles.section}>
        <header className={styles.totals}>
          <h3>{lastYear}</h3>
          <span>{moneyFormatter.format(paidLastYear)}</span>
        </header>
      </section>
    </div>
  );
}
