import React from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import classnames from 'classnames';

import { useClients } from 'hooks';

import Block from 'components/ui/Block';
import Section from 'components/elements/Section';
import AddTask from 'components/elements/AddTask';
import AddProject from 'components/elements/AddProject';
import TaskList from 'components/elements/TaskList';
import ProjectList from 'components/elements/ProjectList';
import InvoiceList from 'components/elements/InvoiceList';

import { TASK_STATUS } from 'constants.js';

import styles from './Client.module.scss';

const Client = () => {
  const { client } = useClients();
  const { ref, inView, entry } = useInView({
    threshold: 0,
  });

  if (!client) {
    return <p>Loading...</p>;
  }

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

            <Section headline="Tasks" headerOffset="2.1rem">
              <TaskList headline="Estimated" status={TASK_STATUS.estimated} />
              <TaskList headline="To do" status={TASK_STATUS.todo} />
              <TaskList headline="Completed" status={TASK_STATUS.completed} />
            </Section>
          </Block>
        </main>

        <aside className={styles.aside}>
          <Block>
            <Section headline="Projects" minHeight="10rem" headerOffset="24px">
              <AddProject />
              <ProjectList />
            </Section>

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
