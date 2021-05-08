import { useContext } from 'react';
import { ClientContext } from 'contexts';

const useClients = () => useContext(ClientContext);

export default useClients;
