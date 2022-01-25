import { createContext, useContext } from 'react';

export const NewInvoiceContext = createContext({
  /** @var bool */
  isInvoicing: false,
});

const useNewInvoice = () => useContext(NewInvoiceContext);

export default useNewInvoice;
