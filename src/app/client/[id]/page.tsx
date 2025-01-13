'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useGlobals } from '@/contexts/GlobalContext';
import Button from '@/components/button';
import IconArrowLeft from '@/icons/arrow-back';
import IconSettings from '@/icons/settings';
import IconPlus from '@/icons/plus';

import styles from './client-page.module.css';
import TaskForm from '@/components/task-form';

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
        <Button onClick={() => {}} icon={IconPlus}>
          Add task
        </Button>
      </div>
    </>
  );
}

export default function ClientPage() {
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const { id }: { id: string } = useParams();
  const { getClientById, toggleClientFormVisible } = useGlobals();
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
          <Button
            icon={IconSettings}
            style="secondary"
            onClick={() => toggleClientFormVisible(client.id)}
          >
            Edit client
          </Button>
        )}
      </nav>

      <ClientPageMain />

      {/* {client && (
        <TaskForm
          toggleVisibility={setIsTaskFormVisible}
          visible={isTaskFormVisible}
        />
      )} */}
    </div>
  );
}
