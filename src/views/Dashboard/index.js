import React from 'react';
import ClientList from 'components/elements/ClientList';
import AddClient from 'components/elements/AddClient';
import { useAuth } from 'hooks';

import Block from 'components/ui/Block';
import Section from 'components/elements/Section';

import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const { userData } = useAuth();

  return (
    <div className={styles.dash}>
      <main className={styles.main}>
        <Block>
          <p className={styles.greeting}>Howdy, {userData.firstName}</p>
        </Block>
        <Block>
          <Section headline="Clients">
            <AddClient />
            <ClientList />
          </Section>
        </Block>
      </main>

      <aside className={styles.overview}>
        <Block>
          <h2>Overview</h2>
        </Block>
      </aside>
    </div>
  );
};

export default Dashboard;
