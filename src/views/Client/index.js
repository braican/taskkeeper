import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useClients } from 'hooks';

import SplitLayout from 'components/layouts/SplitLayout';
import Section from 'components/elements/Section';

import styles from './Client.module.scss';

const Client = () => {
  const { id } = useParams();
  const { client } = useClients(id);

  return (
    <SplitLayout>
      <div className={styles.tasks}>
        <Link to="/dashboard">&larr; Dashboard</Link>
        <h2>{client.name}</h2>

        <Section headline="Tasks">
          <p>Tasks here</p>
        </Section>
      </div>

      <div>
        <h2>No invoices</h2>
      </div>
    </SplitLayout>
  );
};

export default Client;
