import React from 'react';
import ClientList from 'components/elements/ClientList';
import AddClient from 'components/elements/AddClient';
import { useAuth } from 'hooks';

import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const { userData } = useAuth();

  const timeGreeting = () => {
    const d = new Date();
    const hours = d.getHours();

    if (hours < 11) {
      return `Hey good morning ${userData.firstName}. Make it a good day.`;
    }

    if (hours < 16) {
      return `What's for lunch?`;
    }

    return `Hey ${userData.firstName}, don't work too late tonight.`;
  };
  return (
    <div className={styles.dash}>
      <section className={styles.clientList}>
        <header>
          <p>{timeGreeting()}</p>
        </header>

        <div>
          <h2>Client list</h2>
          <AddClient />
          <ClientList />
        </div>
      </section>

      <section className={styles.overview}>
        <h2>Overview</h2>
      </section>
    </div>
  );
};

export default Dashboard;
