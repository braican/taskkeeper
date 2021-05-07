import React, { useEffect, useState } from 'react';
import { useAuth } from 'hooks';
import { post, cancellablePromise } from 'util/index';

import styles from './ClientList.module.scss';

const ClientList = () => {
  const [clients, setClients] = useState([]);
  const { userData } = useAuth();

  const fetchClients = async () => {
    try {
      return await post('getClients', { secret: userData.secret });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    // const cancelFetch = cancellablePromise(function* () {
    //   const { clients } = yield fetchClients();
    //   setClients(clients);
    // });
    // return () => {
    //   cancelFetch();
    // };
  }, []);

  return (
    <div>
      <ul>
        {clients.map(client => (
          <li key={client.id}>{client.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default ClientList;
