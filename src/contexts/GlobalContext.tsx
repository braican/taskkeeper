// contexts/GlobalContext.tsx
'use client';

import pb from '@/lib/pocketbase';
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/types';

interface GlobalContextType {
  areClientsLoaded: boolean;
  clients: Client[];
  addClient: (client: Omit<Client, 'id'>) => Promise<void>;
  getClientById: (id: string) => Client | undefined | null;
  isNewClientFormVisible: boolean;
  toggleNewClientFormVisible: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isNewClientFormVisible, setIsNewClientFormVisible] = useState(false);
  const [areClientsLoaded, setClientsLoaded] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const { user } = useAuth();
  const hasFetchedRef = useRef(false); // Add this line

  // Fetch clients on component mount
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    async function fetchClients() {
      console.log('!! Fetch clients');

      try {
        const records = await pb.collection('clients').getFullList();

        // Only update state if component is still mounted
        const clients = records.map((record) => ({
          id: record.id,
          name: record.name,
          key: record.key,
          rate: record.rate,
          address: record.address,
        }));
        setClientsLoaded(true);
        setClients(clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }

    fetchClients();
  }, []);

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const record = await pb
        .collection('clients')
        .create({ ...clientData, user: user?.id });
      setClients((oldClients) => [
        ...oldClients,
        {
          id: record.id,
          name: record.name,
          key: record.key,
          rate: record.rate,
          address: record.address,
        },
      ]);
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const getClientById = (id: string) => {
    if (clients.length < 1) {
      return null;
    }

    return clients.find((client) => client.id === id);
  };

  const toggleNewClientFormVisible = () => {
    setIsNewClientFormVisible(!isNewClientFormVisible);
  };

  return (
    <GlobalContext.Provider
      value={{
        areClientsLoaded,
        clients,
        addClient,
        getClientById,
        isNewClientFormVisible,
        toggleNewClientFormVisible,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobals = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobals must be used within a GlobalProvider');
  }
  return context;
};
