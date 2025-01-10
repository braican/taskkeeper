// contexts/GlobalContext.tsx
'use client';

import { ReactNode, createContext, useContext, useState } from 'react';

interface GlobalContextType {
  isNewClientFormVisible: boolean;
  toggleNewClientFormVisible: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const [isNewClientFormVisible, setIsNewClientFormVisible] = useState(false);

  const toggleNewClientFormVisible = () => {
    setIsNewClientFormVisible(!isNewClientFormVisible);
  };

  return (
    <GlobalContext.Provider
      value={{ isNewClientFormVisible, toggleNewClientFormVisible }}
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
