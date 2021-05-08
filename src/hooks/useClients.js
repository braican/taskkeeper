import { createContext, useContext } from 'react';

/**
 * @returns array
 */
export const ClientContext = createContext({
  /** @var object */
  clients: {},

  /** @var object */
  client: {},

  /** @var function */
  addClient: () => {},
});

const useClients = (id = null) => {
  const clientData = useContext(ClientContext);
  const client = id ? clientData.clients[id] : null;

  return { ...clientData, client };
};

export default useClients;
