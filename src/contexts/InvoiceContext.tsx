// contexts/TaskContext.tsx
'use client';

import { ClientResponseError, RecordModel } from 'pocketbase';
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
  invoices: Invoice[];
  addInvoice: (invoiceData: Omit<Invoice, 'id'>) => Promise<void>;
  getActiveInvoices: (invoiceList?: Invoice[]) => {
    pending: Invoice[];
    sent: Invoice[];
  };
  getClientInvoices: (clientId: string) => {
    activeInvoices: Invoice[];
    paidInvoices: Invoice[];
  };
  getNextInvoiceNumber: (client: Client) => Promise<string>;
  setInvoicePaid: (invoiceId: string, paidDate?: string) => Promise<void>;
  fetchAllPaidClientInvoices: (clientId: string) => Promise<Invoice[]>;
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
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const hasFetchedRef = useRef(false);

  // Fetch invoices on component mount
  useEffect(() => {
    if (hasFetchedRef.current || !user) return;
    hasFetchedRef.current = true;

    async function fetchInvoices() {
      console.log('!! Fetch invoices');

      const currentYear = new Date().getFullYear();
      try {
        const records = await pb.collection('invoices').getFullList({
          filter: `(status = "active" || issueDate>"${currentYear - 2}-01-01")`,
        });
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

      const batch = pb.createBatch();
      const taskIds = invoiceData.tasks.map((task) => task.id);
      taskIds.forEach((id) => {
        batch.collection('tasks').delete(id);
      });
      await batch.send();

      setInvoices((oldInvoices) => [...oldInvoices, recordToInvoice(record)]);
      setTasks((oldTasks) =>
        oldTasks.filter((task) => !taskIds.includes(task.id)),
      );
    } catch (error) {
      console.error('Error adding invoice:', error);
      throw error;
    }
  };

  const getActiveInvoices = (
    invoiceList?: Invoice[],
  ): {
    pending: Invoice[];
    sent: Invoice[];
  } => {
    if (typeof invoiceList === 'undefined') {
      invoiceList = invoices.filter((invoice) => invoice.status === 'active');
    }

    return invoiceList.reduce(
      (acc, invoice) => {
        const issueDate = new Date(invoice.issueDate);
        const today = new Date();
        if (issueDate > today) {
          acc.pending.push(invoice);
        } else {
          acc.sent.push(invoice);
        }
        return acc;
      },
      { pending: [] as Invoice[], sent: [] as Invoice[] },
    );
  };

  const getClientInvoices = (
    clientId: string,
  ): {
    activeInvoices: Invoice[];
    paidInvoices: Invoice[];
  } => {
    return invoices
      .filter((invoice) => invoice.client === clientId)
      .reduce(
        (acc, invoice) => {
          if (invoice.status === 'active') {
            acc.activeInvoices.push(invoice);
          } else if (invoice.status === 'paid') {
            acc.paidInvoices.push(invoice);
          }
          return acc;
        },
        { activeInvoices: [] as Invoice[], paidInvoices: [] as Invoice[] },
      );
  };

  const getNextInvoiceNumber = async (client: Client): Promise<string> => {
    try {
      const record = await pb
        .collection('invoices')
        .getFirstListItem(`client="${client.id}"`, {
          sort: '-number',
        });

      const newInvoiceNumber = record?.number.split('-')[1] || '0';
      return `${client.key}-${(parseInt(newInvoiceNumber) + 1).toString().padStart(4, '0')}`;
    } catch (error) {
      if (!(error instanceof ClientResponseError && error.status === 404)) {
        console.error('Error fetching the latest invoice:', error);
      }

      return `${client.key}-0001`;
    }
  };

  const setInvoicePaid = async (invoiceId: string, paidDate?: string) => {
    if (!invoiceId) {
      return;
    }

    try {
      const newInvoiceData: Pick<Invoice, 'status' | 'paidDate'> = {
        status: 'paid',
        paidDate,
      };
      await pb.collection('invoices').update(invoiceId, newInvoiceData);

      setInvoices((oldInvoices) =>
        oldInvoices.map((invoice) => {
          if (invoice.id !== invoiceId) {
            return invoice;
          }

          return { ...invoice, ...newInvoiceData };
        }),
      );
    } catch (error) {
      console.error('Error updating the invoice:', error);
      throw error;
    }
  };

  const fetchAllPaidClientInvoices = async (clientId: string) => {
    try {
      const allPaidInvoices = await pb.collection('invoices').getFullList({
        filter: `client="${clientId}"`,
      });

      return allPaidInvoices.map((record) => recordToInvoice(record));
    } catch (error) {
      console.error('Error fetching paid invoices for the client:', error);
      return [];
    }
  };

  return (
    <InvoiceContext.Provider
      value={{
        areInvoicedLoaded,
        invoices,
        addInvoice,
        getActiveInvoices,
        getClientInvoices,
        getNextInvoiceNumber,
        setInvoicePaid,
        fetchAllPaidClientInvoices,
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
