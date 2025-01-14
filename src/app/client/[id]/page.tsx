'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGlobals } from '@/contexts/GlobalContext';
import { useClients } from '@/contexts/ClientContext';
import Button from '@/components/button';
import IconArrowLeft from '@/icons/arrow-back';
import IconSettings from '@/icons/settings';
import IconPlus from '@/icons/plus';
import IconAddInvoice from '@/icons/add-invoice';

import styles from './client-page.module.css';
import TaskForm from '@/components/task-form';
import TaskList from '@/components/task-list';

function ClientPageMain() {
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const { id }: { id: string } = useParams();
  const { getClientById, areClientsLoaded } = useClients();
  const client = getClientById(id);

  if (!areClientsLoaded) {
    return <p>Loading...</p>;
  }

  if (!client) {
    return <p>404: Client not found</p>;
  }

  return (
    <>
      <header>
        <div className="client-superscript">
          <h1 className="page-title">{client.name}</h1>
          <span>{client.key}</span>
        </div>
        <p>${client.rate}/hour</p>

        {client.address && <p>{client.address}</p>}
      </header>

      <div className={styles.main}>
        <div className={styles.actions}>
          <Button onClick={() => setIsTaskFormVisible(true)} icon={IconPlus}>
            Add task
          </Button>
          <Button onClick={() => {}} icon={IconAddInvoice} style="secondary">
            Create invoice
          </Button>
        </div>

        <div className={styles.taskList}>
          <TaskList client={client} />
        </div>
      </div>

      {client && (
        <TaskForm
          client={client}
          visible={isTaskFormVisible}
          setVisibility={setIsTaskFormVisible}
        />
      )}
    </>
  );
}

export default function ClientPage() {
  const { id }: { id: string } = useParams();
  const { toggleClientFormVisible } = useGlobals();
  const { getClientById } = useClients();
  const client = getClientById(id);

  return (
    <div>
      <nav className={styles.breadcrumbs}>
        <Link
          href="/dashboard"
          className={`with-icon basic-link ${styles.dashboardLink}`}
        >
          <span className={styles.dashboardIcon}>
            <IconArrowLeft />
          </span>
          <span>Dashboard</span>
        </Link>

        {client && (
          <Button
            icon={IconSettings}
            style="secondary"
            size="small"
            onClick={() => toggleClientFormVisible(client.id)}
          >
            Edit client
          </Button>
        )}
      </nav>

      <ClientPageMain />
    </div>
  );
}
