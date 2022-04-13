import React from 'react';
import { Link } from 'react-router-dom';

import { useClients, useTasks, useInvoices } from 'hooks';
import { NewInvoiceProvider } from 'providers';

import Block from 'components/ui/Block';
import Section from 'components/elements/Section';
import AddTask from 'components/elements/AddTask';
import CreateInvoice from 'components/elements/CreateInvoice';
import TaskList from 'components/elements/TaskList';
import InvoiceList from 'components/elements/InvoiceList';
import ActiveInvoice from 'components/elements/ActiveInvoice';

import { TASK_STATUS } from 'constants.js';

import styles from './Client.module.scss';

const Client = () => {
  const { client } = useClients();
  const { clientTasks } = useTasks();
  const { clientInvoices } = useInvoices();

  if (!client) {
    return <p>Loading...</p>;
  }

  const estimatedTasks = clientTasks.filter(t => t.status === TASK_STATUS.estimated);
  const todoTasks = clientTasks.filter(t => t.status === TASK_STATUS.todo);
  const completedTasks = clientTasks.filter(t => t.status === TASK_STATUS.completed);

  return (
    <div className={styles.clientWrap}>
      <header className={styles.header}>
        <Link to="/dashboard" className={styles.backToDash}>
          &larr; Dashboard
        </Link>
        <h2 className={styles.name}>{client.name}</h2>
      </header>

      {clientInvoices.length > 0 && (
        <Block>
          <Section headline="Active Invoices" className={styles.activeInvoices}>
            {clientInvoices.map(invoice => (
              <ActiveInvoice key={invoice.id} invoice={invoice} />
            ))}
          </Section>
        </Block>
      )}

      <section className={styles.layout}>
        <main className={styles.tasks}>
          <NewInvoiceProvider>
            <Block>
              <Section headline="Tasks">
                <div className={styles.addTask}>
                  <AddTask />
                </div>

                {clientTasks.length === 0 ? (
                  <p className={styles.noTasks}>Nothing going on here.</p>
                ) : (
                  <div className={styles.taskGroups}>
                    {estimatedTasks.length > 0 && (
                      <TaskList headline="Estimated" tasks={estimatedTasks} />
                    )}
                    {todoTasks.length > 0 && <TaskList headline="To do" tasks={todoTasks} />}
                    {completedTasks.length > 0 && (
                      <TaskList headline="Completed" tasks={completedTasks} selectable />
                    )}
                  </div>
                )}

                {completedTasks.length > 0 && (
                  <div className={styles.createInvoice}>
                    <CreateInvoice />
                  </div>
                )}
              </Section>
            </Block>
          </NewInvoiceProvider>
        </main>

        <aside className={styles.aside}>
          <Block>
            <Section headline="Past Invoices" className={styles.invoiceSection}>
              <InvoiceList />
            </Section>
          </Block>
        </aside>
      </section>
    </div>
  );
};

export default Client;
