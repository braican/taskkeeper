import React from 'react';
import { useClients } from 'hooks';

import Placard from 'components/ui/Placard';

import styles from './ClientList.module.scss';

const ClientList = () => {
  const { clients } = useClients();

  return (
    <div className={styles.clientlist}>
      <ul>
        {Object.keys(clients).map(clientId => (
          <li key={clientId} className={styles.clientItem}>
            <Placard to={`client/${clientId}`}>
              <span className={styles.rate}>${clients[clientId].rate}</span>
              <span className={styles.clientName}>{clients[clientId].name}</span>
            </Placard>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
