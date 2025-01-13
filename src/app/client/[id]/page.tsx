'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGlobals } from '@/contexts/GlobalContext';

import styles from './client-page.module.css';
import IconArrowLeft from '@/icons/arrow-back';

function ClientPageMain() {
  const { id }: { id: string } = useParams();
  const { getClientById, areClientsLoaded } = useGlobals();
  const client = getClientById(id);

  if (!areClientsLoaded) {
    return <p>Loading...</p>;
  }

  if (!client) {
    return <p>404: Client not found</p>;
  }

  return (
    <header>
      <h1 className="page-title">{client.name}</h1>
    </header>
  );
}

export default function ClientPage() {
  return (
    <div>
      <nav className={styles.breadcrumbs}>
        <Link href="/dashboard" className={styles.dashboardLink}>
          <span className={styles.dashboardIcon}>
            <IconArrowLeft />
          </span>
          <span>Dashboard</span>
        </Link>
      </nav>

      <ClientPageMain />
    </div>
  );
}
