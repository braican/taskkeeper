import React from 'react';
import { Link } from 'react-router-dom';

import { useClients, useTasks, useInvoices } from 'hooks';
import { NewInvoiceProvider } from 'providers';
import { INVOICE_STATUS, TASK_STATUS } from 'constants.js';

import Block from 'components/ui/Block';
import Section from 'components/elements/Section';
import AddTask from 'components/elements/AddTask';
import CreateInvoice from 'components/elements/CreateInvoice';
import TaskList from 'components/elements/TaskList';
import ActiveInvoice from 'components/elements/ActiveInvoice';
import PaidInvoice from 'components/elements/PaidInvoice';
import Button from 'components/ui/Button';
import Icon from 'components/ui/Icon';

import styles from './Client.module.scss';

const Client = () => {
  const { client } = useClients();
  const { clientTasks } = useTasks();
  const { clientInvoices } = useInvoices();

  if (!client) {
    return <p>Loading...</p>;
  }

  const activeInvoices = clientInvoices.filter(({ status }) => status === INVOICE_STATUS.active);
  const paidInvoices = clientInvoices.filter(({ status }) => status === INVOICE_STATUS.paid);

  const estimatedTasks = clientTasks.filter(t => t.status === TASK_STATUS.estimated);
  const todoTasks = clientTasks.filter(t => t.status === TASK_STATUS.todo);
  const completedTasks = clientTasks.filter(t => t.status === TASK_STATUS.completed);

  return (
    <div className={styles.clientWrap}>
      <header className={styles.header}>
        <div className={styles.utility}>
          <Link to="/dashboard" className={styles.backToDash}>
            &larr; Dashboard
          </Link>

          <Button style="translucent">
            <Icon icon="cog" inline label="Client" />
          </Button>
        </div>

        <div className={styles.headerRows}>
          <h1 className={styles.name}>{client.name}</h1>

          <div className={styles.meta}>
            <p className={styles.address}>{client.address}</p>
            <p className={styles.rate}>
              <span>Rate</span>${client.rate}
            </p>
          </div>
        </div>
      </header>

      {activeInvoices.length > 0 && (
        <Block>
          <Section headline="Invoices" className={styles.activeInvoices}>
            {activeInvoices.map(invoice => (
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
                    <TaskList headline="Estimated" tasks={estimatedTasks} />
                    <TaskList headline="To do" tasks={todoTasks} />
                    <TaskList headline="Completed" tasks={completedTasks} selectable />
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
              {paidInvoices.length > 0 ? (
                <div>
                  {paidInvoices.map(invoice => (
                    <PaidInvoice invoice={invoice} key={invoice.id} />
                  ))}
                </div>
              ) : (
                <p>No past invoices.</p>
              )}
            </Section>
          </Block>
        </aside>
      </section>
    </div>
  );
};

export default Client;
