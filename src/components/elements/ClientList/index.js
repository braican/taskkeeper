import React from 'react';
import { Link } from 'react-router-dom';
import { useClients } from 'hooks';

import styles from './ClientList.module.scss';

const ClientList = () => {
  const { clients } = useClients();

  return (
    <div>
      <ul>
        {Object.keys(clients).map(clientId => (
          <li key={clientId} className={styles.clientItem}>
            <Link to={`client/${clientId}`} className={styles.client}>
              {clients[clientId].name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
