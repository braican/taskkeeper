import React from 'react';
import ClientList from 'components/elements/ClientList';
import AddClient from 'components/elements/AddClient';
import { useAuth } from 'hooks';

import Block from 'components/ui/Block';
import Section from 'components/elements/Section';

import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const { userData } = useAuth();

  const timeGreeting = () => {
    const d = new Date();
    const hours = d.getHours();

    if (hours < 10) {
      return `Hey good morning ${userData.firstName}. Make it a good day.`;
    }

    if (hours < 13) {
      return `What's for lunch?`;
    }

    if (hours < 17) {
      return `Enjoy that late afternoon sun ${userData.firstName}. Or rain, if it's raining.`;
    }

    return `Evening ${userData.firstName}.`;
  };

  return (
    <div className={styles.dash}>
      <main className={styles.main}>
        <Block>
          <p className={styles.greeting}>{timeGreeting()}</p>
        </Block>
        <Block>
          <div className={styles.addClient}>
            <AddClient />
          </div>
          <Section headline="Clients">
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
