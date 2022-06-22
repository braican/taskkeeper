import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useAuth, InvoiceContext } from 'hooks';
import { cancellablePromise } from 'util/index';

const InvoiceProvider = ({ children }) => {
  const { post } = useAuth();
  const [invoices, setInvoices] = useState([]);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    if (!fetched) {
      const cancelFetch = cancellablePromise(function* () {
        const { invoices } = yield post('getInvoices');
        setInvoices(invoices);
        setFetched(true);
      }, 'invoiceFetch');

      return () => {
        cancelFetch();
      };
    }
  }, []);

  /**
   * Add a new invoice to state.
   *
   * @param {object} newInvoice The new invoice.
   *
   * @return void
   */
  const addInvoice = newInvoice => {
    const newInvoices = [...invoices, newInvoice];
    setInvoices(newInvoices);
  };

  /**
   * Update an invoice in state.
   *
   * @param {object} newInvoice Invoice data.
   *
   * @return void
   */
  const updateInvoice = newInvoice => {
    const newInvoices = [...invoices].map(invoice =>
      invoice.id === newInvoice.id ? newInvoice : invoice,
    );
    setInvoices(newInvoices);
  };

  return (
    <InvoiceContext.Provider value={{ invoices, updateInvoice, addInvoice }}>
      {children}
    </InvoiceContext.Provider>
  );
};

InvoiceProvider.propTypes = {
  children: PropTypes.node,
};

export default InvoiceProvider;
