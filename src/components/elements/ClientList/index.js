import React from 'react';
import { Link } from 'react-router-dom';
import { useClients } from 'hooks';

import styles from './ClientList.module.scss';

const ClientList = () => {
  const { clients } = useClients();

  return (
    <div className={styles.clientlist}>
      <ul>
        {Object.keys(clients).map(clientId => (
          <li key={clientId} className={styles.clientItem}>
            <Link to={`client/${clientId}`} className={styles.client}>
              <span className={styles.rate}>${clients[clientId].rate}</span>
              <span className={styles.clientName}>{clients[clientId].name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
