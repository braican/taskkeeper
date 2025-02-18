import Link from 'next/link';
import { useClients } from '@/contexts/ClientContext';
import { useTasks } from '@/contexts/TaskContext';
import { useInvoices } from '@/contexts/InvoiceContext';

import styles from './client-list.module.css';

export default function ClientList() {
  const { clients, areClientsLoaded } = useClients();
  const { getClientTasks } = useTasks();
  const { getClientInvoices, getActiveInvoices } = useInvoices();
  const sortedClients = clients
    .map((client) => {
      const { activeInvoices } = getClientInvoices(client.id);
      const { pending, sent } = getActiveInvoices(activeInvoices);
      const activeTasks = getClientTasks(client.id);

      return {
        ...client,
        activeTasks,
        activePending: pending,
        activeSent: sent,
        hasStatus:
          activeTasks.length > 0 || pending.length > 0 || sent.length > 0,
      };
    })
    .sort((a, b) => {
      if (a.hasStatus && !b.hasStatus) {
        return -1;
      }
      if (!a.hasStatus && b.hasStatus) {
        return 1;
      }

      return a.name.localeCompare(b.name);
    });

  if (!areClientsLoaded) {
    return <p>Loading clients...</p>;
  }

  if (clients.length < 1) {
    return <p>No clients</p>;
  }

  return (
    <ul className={`ul-reset ${styles.list}`}>
      {sortedClients.map((client) => (
        <li key={client.id} className={styles.item}>
          <Link
            href={`/client/${client.id}`}
            className={`${styles.link} ${client.hasStatus ? styles.hasStatus : ''}`}
          >
            <div className={styles.inner}>
              <div className={styles.clientMain}>
                <div>
                  <h3 className="fs-2 ff-display">{client.name}</h3>
                  <p className={styles.key}>&nbsp;&nbsp;{client.key}</p>
                </div>
                <p>${client.rate}/hour</p>
              </div>
              <div className={styles.statuses}>
                {client.activeTasks.length > 0 && (
                  <p>
                    {client.activeTasks.length} open task
                    {client.activeTasks.length === 1 ? '' : 's'}
                  </p>
                )}

                {client.activeSent.length > 0 && (
                  <p>
                    <strong>
                      {client.activeSent.length} active invoice
                      {client.activeSent.length === 1 ? '' : 's'}
                    </strong>
                  </p>
                )}
                {client.activePending.length > 0 && (
                  <p>
                    {client.activePending.length} invoice
                    {client.activePending.length === 1 ? '' : 's'} pending
                  </p>
                )}
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
