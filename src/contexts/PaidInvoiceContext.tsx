// contexts/PaidInvoiceContext.tsx
'use client';

import pb from '@/lib/pocketbase';
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { recordToInvoice } from '@/contexts/InvoiceContext';
import { Client, Invoice } from '@/types';

interface PaidInvoiceContextType {
  areInvoicedLoaded: boolean;
  paidInvoices: Invoice[];
  addPaidInvoice: (invoice?: Invoice) => void;
}

const PaidInvoiceContext = createContext<PaidInvoiceContextType | undefined>(
  undefined,
);

export const PaidInvoiceProvider = ({
  children,
  client,
}: {
  children: ReactNode;
  client: Client;
}) => {
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);
  const [areInvoicedLoaded, setInvoicedLoaded] = useState(false);
  const [paidInvoices, setPaidInvoices] = useState<Invoice[]>([]);

  // Fetch invoices on component mount
  useEffect(() => {
    if (hasFetchedRef.current || !user) return;
    hasFetchedRef.current = true;

    async function fetchInvoices() {
      try {
        const records = await pb.collection('invoices').getFullList({
          filter: `(status = "paid" && client = "${client.id}")`,
        });
        const invoices = records.map(recordToInvoice);
        setInvoicedLoaded(true);
        setPaidInvoices(invoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    }

    fetchInvoices();
  }, [user, client.id]);

  const addPaidInvoice = (invoice: Invoice | undefined) => {
    if (!invoice) {
      return;
    }

    setPaidInvoices((oldInvoices) => [...oldInvoices, invoice]);
  };

  return (
    <PaidInvoiceContext.Provider
      value={{
        areInvoicedLoaded,
        paidInvoices,
        addPaidInvoice,
      }}
    >
      {children}
    </PaidInvoiceContext.Provider>
  );
};

export const usePaidInvoices = () => {
  const context = useContext(PaidInvoiceContext);
  if (!context) {
    throw new Error(
      'usePaidInvoices must be used within a PaidInvoiceProvider',
    );
  }
  return context;
};
