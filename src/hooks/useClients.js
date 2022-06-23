import { createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';

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

const useClients = () => {
  const { clientId } = useParams();
  const clientData = useContext(ClientContext);
  const client = clientId ? clientData.clients[clientId] : null;

  return { ...clientData, client };
};

export default useClients;
