'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGlobals } from '@/contexts/GlobalContext';

import styles from './client-page.module.css';
import IconArrowLeft from '@/icons/arrow-back';
import Button from '@/components/button';
import IconSettings from '@/icons/settings';

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
      <div className="client-superscript">
        <h1 className="page-title">{client.name}</h1>
        <span>{client.key}</span>
      </div>
      <p>${client.rate}/hour</p>

      {client.address && <p>{client.address}</p>}
    </header>
  );
}

export default function ClientPage() {
  const { id }: { id: string } = useParams();
  const { getClientById } = useGlobals();
  const client = getClientById(id);

  return (
    <div>
      <nav className={styles.breadcrumbs}>
        <Link href="/dashboard" className="with-icon">
          <span className={styles.dashboardIcon}>
            <IconArrowLeft />
          </span>
          <span>Dashboard</span>
        </Link>

        {client && (
          <Button icon={IconSettings} style="secondary">
            Edit client
          </Button>
        )}
      </nav>

      <ClientPageMain />
    </div>
  );
}
