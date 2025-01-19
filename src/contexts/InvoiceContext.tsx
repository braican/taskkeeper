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
import { useTasks } from '@/contexts/TaskContext';
import { Client, Invoice } from '@/types';

interface InvoiceContextType {
  areInvoicedLoaded: boolean;
  activeInvoices: Invoice[];
  addInvoice: (invoiceData: Omit<Invoice, 'id'>) => Promise<void>;
  getClientActiveInvoices: (clientId: string) => Invoice[];
  getNextInvoiceNumber: (client: Client) => string;
  setInvoicePaid: (
    invoiceId: string,
    paidDate?: string,
  ) => Promise<Invoice | undefined>;
}

const InvoiceContext = createContext<InvoiceContextType | undefined>(undefined);

export const recordToInvoice = (record: RecordModel): Invoice => ({
  id: record.id,
  client: record.client,
  number: record.number,
  description: record.description,
  status: record.status,
  issueDate: record.issueDate,
  dueDate: record.dueDate,
  paidDate: record.paidDate,
  tasks: record.tasks,
});

export const InvoiceProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { setTasks } = useTasks();
  const [areInvoicedLoaded, setInvoicedLoaded] = useState(false);
  const [activeInvoices, setActiveInvoices] = useState<Invoice[]>([]);
  const hasFetchedRef = useRef(false);

  // Fetch invoices on component mount
  useEffect(() => {
    if (hasFetchedRef.current || !user) return;
    hasFetchedRef.current = true;

    async function fetchInvoices() {
      console.log('!! Fetch active invoices');

      try {
        const records = await pb.collection('invoices').getFullList({
          filter: 'status = "active"',
        });
        const invoices = records.map(recordToInvoice);
        setInvoicedLoaded(true);
        setActiveInvoices(invoices);
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

      const batch = pb.createBatch();
      const taskIds = invoiceData.tasks.map((task) => task.id);
      taskIds.forEach((id) => {
        batch.collection('tasks').delete(id);
      });
      await batch.send();

      setActiveInvoices((oldInvoices) => [
        ...oldInvoices,
        recordToInvoice(record),
      ]);
      setTasks((oldTasks) =>
        oldTasks.filter((task) => !taskIds.includes(task.id)),
      );
    } catch (error) {
      console.error('Error adding invoice:', error);
      throw error;
    }
  };

  const getClientActiveInvoices = (clientId: string): Invoice[] => {
    return activeInvoices.filter((invoice) => invoice.client === clientId);
  };

  const getNextInvoiceNumber = (client: Client): string => {
    const invoices = getClientActiveInvoices(client.id);
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

      const newlyPaidInvoice = activeInvoices.find(
        (invoice) => invoice.id === invoiceId,
      );

      setActiveInvoices((oldInvoices) =>
        oldInvoices.filter((invoice) => invoice.id !== invoiceId),
      );

      return newlyPaidInvoice
        ? ({
            ...newlyPaidInvoice,
            status: 'paid',
            paidDate,
          } as Invoice)
        : undefined;
    } catch (error) {
      console.error('Error updating the invoice:', error);
      throw error;
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        areInvoicedLoaded,
        activeInvoices,
        addInvoice,
        getClientActiveInvoices,
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
