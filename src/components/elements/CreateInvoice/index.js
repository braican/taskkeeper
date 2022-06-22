import React, { useState } from 'react';
import { useNewInvoice, useInvoices, useAuth, useClients, useTasks } from 'hooks';

import Button from 'components/ui/Button';
import FormModal from 'components/elements/FormModal';
import FormInput from 'components/ui/FormInput';

import { toDateInputValue, addDays } from 'util/index';

import { INVOICE_STATUS } from 'constants.js';

import styles from './CreateInvoice.module.scss';

const CreateInvoice = () => {
  const today = toDateInputValue();
  const net30 = toDateInputValue(addDays(30, new Date(today)));
  const { isInvoicing, setIsInvoicing, removeAllTasks, invoiceTotal, invoicedTasks } =
    useNewInvoice();
  const { removeTasks } = useTasks();
  const { addInvoice } = useInvoices();

  const [description, setDescription] = useState('');
  const [invoiceId, setInvoiceId] = useState('');
  const [issueDate, setIssueDate] = useState(today);
  const [dueDate, setDueDate] = useState(net30);

  const { post } = useAuth();
  const { client } = useClients();

  const addInvoiceToDb = () => {
    if (invoicedTasks.length === 0) {
      // eslint-disable-next-line
      console.warning('No tasks selected!');
      return;
    }

    const invoice = {
      description,
      invoiceId,
      total: invoiceTotal,
      status: INVOICE_STATUS.active,
      issued: issueDate,
      due: dueDate,
      client: client.id,
      rate: client.rate,
      tasks: invoicedTasks,
    };

    post('addInvoice', { invoice })
      .then(({ invoice }) => {
        removeTasks(invoicedTasks.map(({ id }) => id));
        addInvoice(invoice);
        setIsInvoicing(false);
      })
      .catch(console.error);
  };

  if (isInvoicing === false) {
    return (
      <Button style={['fullwidth', 'green']} onClick={() => setIsInvoicing(true)}>
        Create an Invoice
      </Button>
    );
  }

  return (
    <FormModal
      onSubmit={addInvoiceToDb}
      onCancel={() => {
        setIsInvoicing(false);
        setDescription('');
        setIssueDate(today);
        setDueDate(net30);
        removeAllTasks();
      }}>
      <div className={styles.formGrid}>
        <span className={styles.total}>${invoiceTotal}</span>

        <FormInput
          label="Invoice ID"
          type="text"
          value={invoiceId}
          className={styles.id}
          onChange={event => setInvoiceId(event.target.value)}
        />

        <FormInput
          label="Issue Date"
          type="date"
          value={issueDate}
          onChange={event => {
            setIssueDate(event.target.value);
            setDueDate(toDateInputValue(addDays(30, new Date(event.target.value))));
          }}
        />

        <FormInput
          label="Due Date"
          type="date"
          value={dueDate}
          onChange={event => setDueDate(event.target.value)}
        />

        <FormInput
          label="Description"
          type="textarea"
          value={description}
          className={styles.description}
          onChange={event => setDescription(event.target.value)}
        />
      </div>
    </FormModal>
  );
};

CreateInvoice.propTypes = {};

export default CreateInvoice;
