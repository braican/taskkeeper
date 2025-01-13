import { useGlobals } from '@/contexts/GlobalContext';
import Link from 'next/link';
import styles from './client-list.module.css';

export default function ClientList() {
  const { clients, areClientsLoaded } = useGlobals();

  if (!areClientsLoaded) {
    return <p>Loading clients...</p>;
  }

  if (clients.length < 1) {
    return <p>No clients</p>;
  }

  return (
    <ul className={`ul-reset ${styles.list}`}>
      {clients.map((client) => (
        <li key={client.id} className={styles.item}>
          <Link href={`/client/${client.id}`} className={styles.link}>
            <div className={styles.inner}>
              <div className="client-superscript">
                <h3 className={styles.name}>{client.name}</h3>
                <p>{client.key}</p>
              </div>
              <p>${client.rate}/hour</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
