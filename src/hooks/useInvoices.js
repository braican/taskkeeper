import { createContext, useContext } from 'react';
import { useClients } from 'hooks/index.js';

export const InvoiceContext = createContext({
  /** @var array */
  invoices: [],

  /** @var array */
  clientInvoices: [],
});

const useInvoices = () => {
  const invoiceData = useContext(InvoiceContext);
  const { client } = useClients();
  const clientInvoices = client ? invoiceData.invoices.filter(t => t.client === client.id) : [];

  return { ...invoiceData, clientInvoices };
};

export default useInvoices;
