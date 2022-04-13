import React from 'react';
import ClientList from 'components/elements/ClientList';
import AddClient from 'components/elements/AddClient';
import { useAuth, useInvoices } from 'hooks';

import Block from 'components/ui/Block';
import Section from 'components/elements/Section';
import ActiveInvoice from 'components/elements/ActiveInvoice';

import styles from './Dashboard.module.scss';

const Dashboard = () => {
  const { userData } = useAuth();
  const { activeInvoices } = useInvoices();

  return (
    <div className={styles.dashboard}>
      <Block>
        <p className={styles.greeting}>Howdy, {userData.firstName}</p>
      </Block>
      <div className={styles.dash}>
        <main className={styles.main}>
          <Block>
            <Section headline="Clients">
              <AddClient />
              <ClientList />
            </Section>
          </Block>
        </main>

        <aside className={styles.overview}>
          <Block>
            {activeInvoices.length > 0 ? (
              <Section headline="Active Invoices">
                <ul>
                  {activeInvoices.map(invoice => (
                    <li key={invoice.id}>
                      <ActiveInvoice invoice={invoice} />
                    </li>
                  ))}
                </ul>
              </Section>
            ) : (
              <p>No open invoices.</p>
            )}
          </Block>
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
