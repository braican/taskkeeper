// contexts/ClientContext.tsx
'use client';

import { RecordModel } from 'pocketbase';
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

interface ClientContextType {
  areClientsLoaded: boolean;
  clients: Client[];
  addClient: (clientData: Omit<Client, 'id'>) => Promise<void>;
  updateClient: (clientData: Client) => Promise<void>;
  getClientById: (id: string) => Client | undefined | null;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

const recordToClient = (record: RecordModel): Client => ({
  id: record.id,
  name: record.name,
  key: record.key,
  rate: record.rate,
  address: record.address,
});

export const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [areClientsLoaded, setClientsLoaded] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);

  // Fetch clients on component mount
  useEffect(() => {
    if (hasFetchedRef.current || !user) return;
    hasFetchedRef.current = true;

    async function fetchClients() {
      console.log('!! Fetch clients');

      try {
        const records = await pb.collection('clients').getFullList();
        const clients = records.map(recordToClient);
        setClientsLoaded(true);
        setClients(clients);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    }

    fetchClients();
  }, [user]);

  const addClient = async (clientData: Omit<Client, 'id'>) => {
    if (!clientData.name) {
      return;
    }

    try {
      const record = await pb
        .collection('clients')
        .create({ ...clientData, user: user?.id });
      setClients((oldClients) => [...oldClients, recordToClient(record)]);
    } catch (error) {
      console.error('Error adding client:', error);
      throw error;
    }
  };

  const updateClient = async (clientData: Client) => {
    if (!clientData.id) {
      return;
    }

    try {
      await pb.collection('clients').update(clientData.id, clientData);

      setClients((oldClients) =>
        oldClients.map((client) => {
          if (client.id !== clientData.id) {
            return client;
          }

          return { ...client, ...clientData };
        }),
      );
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  };

  const getClientById = (id: string) => {
    if (clients.length < 1) {
      return null;
    }

    return clients.find((client) => client.id === id);
  };

  return (
    <ClientContext.Provider
      value={{
        areClientsLoaded,
        clients,
        addClient,
        updateClient,
        getClientById,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
};

export const useClients = () => {
  const context = useContext(ClientContext);
  if (!context) {
    throw new Error('useClients must be used within a ClientProvider');
  }
  return context;
};
