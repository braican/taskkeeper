import React from 'react';
import { Link } from 'react-router-dom';
import { useClients } from 'hooks';

import SplitLayout from 'components/layouts/SplitLayout';
import Block from 'components/ui/Block';
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
    <>
      <header className={styles.header}>
        <Link to="/dashboard" className={styles.backToDash}>
          &larr; Dashboard
        </Link>
        <h2 className={styles.name}>{client.name}</h2>
      </header>
      <SplitLayout split="uneven">
        <div className={styles.tasks}>
          <Block>
            <div className={styles.addTask}>
              <AddTask />
            </div>

            <Section headline="Estimated">
              <TaskList status={TASK_STATUS.estimated} />
            </Section>

            <Section headline="To do">
              <TaskList headline="To do" status={TASK_STATUS.todo} />
              <TaskList headline="Completed" status={TASK_STATUS.completed} />
            </Section>
          </Block>
        </div>

        <div>
          <Block>
            <h2>No invoices</h2>
          </Block>
        </div>
      </SplitLayout>
    </>
  );
};

export default Client;
