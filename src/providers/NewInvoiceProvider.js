import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { NewInvoiceContext, useClients } from 'hooks';

const NewInvoiceProvider = ({ children }) => {
  const { client } = useClients();
  const [isInvoicing, setIsInvoicing] = useState(false);
  const [invoicedTasks, setInvoicedTasks] = useState([]);
  const [invoiceTotal, setInvoiceTotal] = useState(0);

  const updateTotal = newTasks => {
    const newTotal = newTasks.reduce((total, task) => {
      if (task.price) {
        return total + parseFloat(task.price);
      }

      if (task.hours) {
        return total + parseFloat(client.rate) * parseFloat(task.hours);
      }

      return total;
    }, 0);

    setInvoiceTotal(newTotal);
  };

  const addTask = task => {
    const newTasks = [...invoicedTasks, { ...task }];
    setInvoicedTasks(newTasks);
    updateTotal(newTasks);
  };

  const removeTask = task => {
    const newTasks = [...invoicedTasks].filter(({ id }) => id !== task.id);
    setInvoicedTasks(newTasks);
    updateTotal(newTasks);
  };

  const removeAllTasks = () => {
    setInvoicedTasks([]);
    setInvoiceTotal(0);
  };

  return (
    <NewInvoiceContext.Provider
      value={{
        isInvoicing,
        setIsInvoicing,
        addTask,
        removeTask,
        removeAllTasks,
        invoiceTotal,
        invoicedTasks,
      }}>
      {children}
    </NewInvoiceContext.Provider>
  );
};

NewInvoiceProvider.propTypes = {
  children: PropTypes.node,
};

export default NewInvoiceProvider;
