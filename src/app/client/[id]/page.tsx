'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useGlobals } from '@/contexts/GlobalContext';
import { useClients } from '@/contexts/ClientContext';
import {
  NewInvoiceProvider,
  useNewInvoice,
} from '@/contexts/NewInvoiceContext';
import { useAuth } from '@/contexts/AuthContext';
import { useInvoices } from '@/contexts/InvoiceContext';
import { useTasks } from '@/contexts/TaskContext';
import Button from '@/components/button';
import TaskForm from '@/components/task-form';
import TaskList from '@/components/task-list';
import InvoiceForm from '@/components/invoice-form';
import InvoiceList from '@/components/invoice-list';
import PaidInvoiceList from '@/components/paid-invoice-list';
import IconArrowLeft from '@/icons/arrow-back';
import IconSettings from '@/icons/settings';
import IconPlus from '@/icons/plus';
import IconAddInvoice from '@/icons/add-invoice';

import styles from './client-page.module.css';

function ClientPageMain() {
  const { id }: { id: string } = useParams();
  const { setIsInvoicing, isInvoicing } = useNewInvoice();
  const { getClientTasks } = useTasks();
  const { getClientInvoices } = useInvoices();
  const { getClientById, areClientsLoaded } = useClients();
  const [isTaskFormVisible, setIsTaskFormVisible] = useState(false);
  const client = getClientById(id);

  if (!areClientsLoaded) {
    return <p>Loading...</p>;
  }

  if (!client) {
    return <p>404: Client not found</p>;
  }

  const tasks = getClientTasks(client.id);
  const { activeInvoices, paidInvoices } = getClientInvoices(client.id);

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

      <div className={styles.clientPageGrid}>
        {activeInvoices.length > 0 && (
          <div className={styles.invoiceList}>
            <InvoiceList invoices={activeInvoices} />
          </div>
        )}

        <div className={styles.main}>
          {isInvoicing ? (
            <div className={styles.invoiceForm}>
              <InvoiceForm
                client={client}
                onCancel={() => setIsInvoicing(false)}
              />
            </div>
          ) : (
            <div className={styles.actions}>
              <Button
                disabled={isInvoicing}
                onClick={() => setIsTaskFormVisible(true)}
                icon={IconPlus}
              >
                Add task
              </Button>

              {tasks.length > 0 && (
                <Button
                  onClick={() => setIsInvoicing(true)}
                  icon={IconAddInvoice}
                  style="secondary"
                >
                  Create invoice
                </Button>
              )}
            </div>
          )}

          <div className={styles.taskList}>
            <TaskList client={client} tasks={tasks} />
          </div>
        </div>

        <div className={styles.paidInvoices}>
          <header className={styles.paidInvoicesHeader}>
            <h2 className="secondary-header">Paid Invoices</h2>
          </header>
          <PaidInvoiceList invoices={paidInvoices} client={client} />
        </div>
      </div>

      <TaskForm
        client={client}
        visible={isTaskFormVisible}
        setVisibility={setIsTaskFormVisible}
      />
    </>
  );
}

export default function ClientPage() {
  const { id }: { id: string } = useParams();
  const { toggleClientFormVisible } = useGlobals();
  const { getClientById } = useClients();
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const client = getClientById(id);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

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

      <NewInvoiceProvider rate={Number(client?.rate)}>
        <ClientPageMain />
      </NewInvoiceProvider>
    </div>
  );
}
