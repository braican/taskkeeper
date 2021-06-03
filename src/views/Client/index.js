import React from 'react';
import { Link } from 'react-router-dom';
import { useClients } from 'hooks';

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

      <div className={styles.tasks}>
        <Block>
          <AddTask />
        </Block>
        <Block>
          <div className={styles.board}>
            <div className={styles.column}>
              <Section headline="Estimated">
                <TaskList status={TASK_STATUS.estimated} />
              </Section>
            </div>
            <div className={styles.column}>
              <Section headline="To do">
                <TaskList status={TASK_STATUS.todo} />
              </Section>
            </div>
            <div className={styles.column}>
              <Section headline="Completed">
                <TaskList status={TASK_STATUS.completed} />
              </Section>
            </div>
          </div>
        </Block>
      </div>

      <div>
        <Block>
          <h2>No invoices</h2>
        </Block>
      </div>
    </>
  );
};

export default Client;
