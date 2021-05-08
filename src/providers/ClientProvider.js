import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth, ClientContext } from 'hooks';
import { post, cancellablePromise } from 'util/index';

const ClientProvider = ({ children }) => {
  const { userData } = useAuth();
  const [clients, setClients] = useState({});
  const [fetched, setFetched] = useState(false);

  const fetchClients = async () => {
    if (!userData?.secret) {
      console.error(`Can't connect to the database.`);
      return {};
    }

    try {
      return await post('getClients', { secret: userData.secret });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!fetched) {
      const cancelFetch = cancellablePromise(function* () {
        const { clients } = yield fetchClients();

        // Reduce to make a client map.
        const newClients = clients.reduce((map, client) => ({ ...map, [client.id]: client }), {});
        setClients(newClients);
        setFetched(true);
      });
      return () => {
        cancelFetch();
      };
    }
  }, []);

  const addClient = newClient => {
    const newClients = { ...clients };
    newClients[newClient.id] = newClient;
    setClients(newClients);
  };

  return <ClientContext.Provider value={{ clients, addClient }}>{children}</ClientContext.Provider>;
};

ClientProvider.propTypes = {
  children: PropTypes.node,
};

export default ClientProvider;
