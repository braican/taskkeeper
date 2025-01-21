// contexts/GlobalContext.tsx
'use client';

import { ReactNode, createContext, useContext, useState } from 'react';
import { useClients } from '@/contexts/ClientContext';
import { Client } from '@/types';

interface GlobalContextType {
  isClientFormVisible: boolean;
  toggleClientFormVisible: (clientId?: string) => void;
  clientToEdit: Client | null;
  bodyScrollIsLocked: boolean;
  setBodyScrollIsLocked: (shouldLock: boolean) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { getClientById } = useClients();
  const [isClientFormVisible, setIsClientFormVisible] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);
  const [bodyScrollIsLocked, setBodyScrollIsLocked] = useState(false);

  const toggleClientFormVisible = (clientId?: string) => {
    if (clientId) {
      const client = getClientById(clientId);

      if (client) {
        setClientToEdit(client);
      }
    }

    setIsClientFormVisible(!isClientFormVisible);
  };

  return (
    <GlobalContext.Provider
      value={{
        isClientFormVisible,
        toggleClientFormVisible,
        clientToEdit,
        setBodyScrollIsLocked,
        bodyScrollIsLocked,
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
