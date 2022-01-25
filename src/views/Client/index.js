import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import classnames from 'classnames';

import { useClients, useTasks } from 'hooks';

import Block from 'components/ui/Block';
import Section from 'components/elements/Section';
import AddTask from 'components/elements/AddTask';
import TaskList from 'components/elements/TaskList';
import InvoiceList from 'components/elements/InvoiceList';

import { TASK_STATUS } from 'constants.js';

import styles from './Client.module.scss';

const Client = () => {
  const { client } = useClients();
  const { clientTasks } = useTasks();
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

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

      <header
        className={classnames(styles.fixedHeader, entry && !inView && styles.fixedHeaderShow)}>
        <Link to="/dashboard" className={styles.backToDash}>
          &larr; Dash
        </Link>
        <h2 className={styles.fixedName}>{client.name}</h2>
      </header>

      <section className={styles.main}>
        <main className={styles.tasks}>
          <Block>
            <div className={styles.addTask} ref={ref}>
              <AddTask />
            </div>

            {clientTasks.length === 0 ? (
              <p>Nothing going on here.</p>
            ) : (
              <>
                {estimatedTasks.length > 0 && (
                  <Section headline="Estimated">
                    <TaskList tasks={estimatedTasks} />
                  </Section>
                )}
                {todoTasks.length > 0 && (
                  <Section headline="To do">
                    <TaskList tasks={todoTasks} />
                  </Section>
                )}
                {completedTasks.length > 0 && (
                  <Section headline="Completed">
                    <TaskList tasks={completedTasks} />
                  </Section>
                )}
              </>
            )}
          </Block>
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
