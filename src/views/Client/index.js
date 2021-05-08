import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useClients } from 'hooks';

import styles from './Client.module.scss';

const Client = () => {
  const { id } = useParams();
  const { client } = useClients(id);

  return (
    <div className={styles.dash}>
      <section className={styles.tasks}>
        <Link to="/dashboard">&larr; Dashboard</Link>

        <h2>{client.name}</h2>
      </section>
    </div>
  );
};

export default Client;
