import { createContext, useContext } from 'react';
import { useClients } from 'hooks/index.js';
import { INVOICE_STATUS } from 'constants.js';

export const InvoiceContext = createContext({
  /** @var array */
  invoices: [],

  /** @var array */
  clientInvoices: [],
});

const useInvoices = () => {
  const invoiceData = useContext(InvoiceContext);
  const { client } = useClients();
  const clientInvoices = client ? invoiceData.invoices.filter(i => i.client === client.id) : [];
  const activeInvoices = invoiceData.invoices.filter(i => i.status === INVOICE_STATUS.active);

  return { ...invoiceData, clientInvoices, activeInvoices };
};

export default useInvoices;
