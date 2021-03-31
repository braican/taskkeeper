import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks';
import { post, cancellablePromise } from '../../util';

import styles from './ClientList.module.scss';

const ClientList = () => {
  // const [clients, setClients] = useState([]);
  const { userData } = useAuth();

  const fetchClients = async () => {
    try {
      return await post('getClients', { secret: userData.secret });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const cancelFetch = cancellablePromise(function* () {
      const fetchedClients = yield fetchClients();
      console.log(fetchedClients);
    });

    return () => {
      cancelFetch();
    };
  }, []);

  return (
    <div className={styles.clientlist}>
      <h2>Client list</h2>
    </div>
  );
};

export default ClientList;
