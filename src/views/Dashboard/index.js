import React from 'react';
import ClientList from 'components/elements/ClientList';
import AddClient from 'components/elements/AddClient';
import { useAuth } from 'hooks';

import SplitLayout from 'components/layouts/SplitLayout';
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

    return `Hey ${userData.firstName}, don't work too late tonight.`;
  };

  return (
    <SplitLayout>
      <div>
        <Block>
          <header className={styles.header}>
            <p className={styles.greeting}>{timeGreeting()}</p>
          </header>
        </Block>

        <Block>
          <AddClient />

          <Section headline="Clients">
            <ClientList />
          </Section>
        </Block>
      </div>

      <div>
        <Block>
          <h2>Overview</h2>
        </Block>
      </div>
    </SplitLayout>
  );
};

export default Dashboard;
