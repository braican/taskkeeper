// contexts/TaskContext.tsx
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
import { Client, Invoice } from '@/types';

interface InvoiceContextType {
  areInvoicedLoaded: boolean;
  invoices: Invoice[];
  addInvoice: (invoiceData: Omit<Invoice, 'id'>) => void;
  getClientInvoices: (clientId: string) => Invoice[];
  getNextInvoiceNumber: (client: Client) => string;
  setInvoicePaid: (invoiceId: string, paidDate?: string) => void;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

const recordToInvoice = (record: RecordModel): Invoice => ({
  id: record.id,
  client: record.client,
  number: record.number,
  status: record.status,
  issueDate: record.issueDate,
  dueDate: record.dueDate,
  tasks: record.tasks,
  description: record.description,
});

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const [areInvoicedLoaded, setInvoicedLoaded] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const { user } = useAuth();
  const hasFetchedRef = useRef(false);

  // Fetch clients on component mount
  useEffect(() => {
    if (hasFetchedRef.current || !user) return;
    hasFetchedRef.current = true;

    async function fetchInvoices() {
      console.log('!! Fetch invoices');

      try {
        const records = await pb.collection('invoices').getFullList();
        const invoices = records.map(recordToInvoice);
        setInvoicedLoaded(true);
        setInvoices(invoices);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      }
    }

    fetchInvoices();
  }, [user]);

  const addInvoice = async (invoiceData: Omit<Invoice, 'id'>) => {
    try {
      const record = await pb
        .collection('invoices')
        .create({ ...invoiceData, user: user?.id });

      setInvoices((oldInvoices) => [...oldInvoices, recordToInvoice(record)]);
    } catch (error) {
      console.error('Error adding invoice:', error);
      throw error;
    }
  };

  const getClientInvoices = (clientId: string): Invoice[] => {
    return invoices.filter((invoice) => invoice.client === clientId);
  };

  const getNextInvoiceNumber = (client: Client): string => {
    const invoices = getClientInvoices(client.id);
    const latestInvoiceNumber = invoices
      .map((invoice) => {
        const numericPart = invoice.number.split('-')[1] || '1';
        return parseInt(numericPart, 10);
      })
      .reduce((max, current) => Math.max(max, current), 0);
    const newInvoiceNumber = latestInvoiceNumber + 1;

    return `${client.key}-${newInvoiceNumber.toString().padStart(4, '0')}`;
  };

  const setInvoicePaid = async (invoiceId: string, paidDate?: string) => {
    if (!invoiceId) {
      return;
    }

    try {
      await pb
        .collection('invoices')
        .update(invoiceId, { status: 'paid', paidDate });
      setInvoices((oldInvoices) =>
        oldInvoices.map((invoice) => {
          if (invoice.id !== invoiceId) {
            return invoice;
          }
          return { ...invoice, status: 'paid', paidDate };
        }),
      );
    } catch (error) {
      console.error('Error updating the invoice:', error);
      throw error;
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        areInvoicedLoaded,
        invoices,
        addInvoice,
        getClientInvoices,
        getNextInvoiceNumber,
        setInvoicePaid,
      }}
    >
      {children}
    </InvoiceContext.Provider>
  );
};

export const useInvoices = () => {
  const context = useContext(InvoiceContext);
  if (!context) {
    throw new Error('useInvoices must be used within an InvoiceProvider');
  }

  return context;
};
