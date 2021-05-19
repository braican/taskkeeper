import React from 'react';
import { Link } from 'react-router-dom';
import { useClients } from 'hooks';

import SplitLayout from 'components/layouts/SplitLayout';
import Section from 'components/elements/Section';
import AddTask from 'components/elements/AddTask';
import TaskList from 'components/elements/TaskList';

import { TASK_STATUS } from 'constants.js';

import styles from './Client.module.scss';

const Client = () => {
  const { client } = useClients();

  if (!client) {
    return <p>Loading...</p>;
  }

  return (
    <SplitLayout>
      <div className={styles.tasks}>
        <header className={styles.header}>
          <Link to="/dashboard" className={styles.backToDash}>
            &larr; Dashboard
          </Link>
          <h2 className={styles.name}>{client.name}</h2>
        </header>

        <div className={styles.addTask}>
          <AddTask />
        </div>

        <Section headline="Tasks">
          <TaskList headline="Estimated" type={TASK_STATUS.estimated} />
          <TaskList headline="To do" type={TASK_STATUS.todo} />
          <TaskList headline="Completed" type={TASK_STATUS.completed} />
        </Section>
      </div>

      <div>
        <h2>No invoices</h2>
      </div>
    </SplitLayout>
  );
};

export default Client;
