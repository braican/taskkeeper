import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import { ClientContext } from '../Client';
import FormattedPrice from '../Utils/FormattedPrice';
import { getDate, getFutureDate } from '../../utils';
import { invoice as invoiceStatus, task as taskStatus } from '../../utils/status';

import FormEl from '../Forms/FormEl';

import styles from './AddInvoice.module.scss';

const AddInvoice = ({ subtotal, hours, tasks, unsetInvoicing, userRef, firestore }) => {
  const { id: clientId, symbol, nextInvoiceId, setNextInvoiceId } = useContext(ClientContext);
  const [invoiceIdIsEditable, setInvoiceIdEditability] = useState(false);
  const [issueDate, setIssueDate] = useState(getDate());
  const [dueDate, setDueDate] = useState(getFutureDate(30));
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (nextInvoiceId) {
      setInvoiceIdEditability(true);
      return;
    }

    userRef
      .collection('invoices')
      .where('client', '==', clientId)
      .get()
      .then(snapshot => {
        let invoiceCount = 0;
        snapshot.forEach(doc => {
          const { invoiceId: id } = doc.data();
          if (id) {
            const invNumber = parseInt(id.replace(`${symbol}-`, '', id));

            if (!isNaN(invNumber) && invNumber > invoiceCount) {
              invoiceCount = invNumber;
            }
          }
        });

        const newInvoiceNumber = `${invoiceCount + 1}`.padStart(4, '0');
        setNextInvoiceId(`${symbol}-${newInvoiceNumber}`);
      })
      .catch(err => console.error('Error getting client invoices.', err))
      .finally(() => setInvoiceIdEditability(true));
  }, []);

  const handleIssueDateChange = event => {
    const date = event.target.value;
    const newDue = getFutureDate(30, date);
    setIssueDate(date);
    setDueDate(newDue);
  };

  const handleCreate = () => {
    const batch = firestore.batch();

    tasks.forEach(task => {
      const taskRef = userRef.collection('tasks').doc(task);
      batch.update(taskRef, { status: taskStatus.INVOICED });
    });

    batch.commit();

    const invoiceData = {
      client: clientId,
      invoiceId: nextInvoiceId,
      dueDate,
      issueDate,
      description,
      tasks,
      status: invoiceStatus.ACTIVE,
      timestamp: +new Date(),
    };

    userRef.collection('invoices').add(invoiceData);
  };

  return (
    <form className={styles.form}>
      <div className={styles.form__main}>
        <div className={styles.totals}>
          <p className={styles.subtotal}>
            <FormattedPrice price={subtotal} />
          </p>
          <p className={styles.hours}>{hours} hours</p>

          <FormEl
            className={styles.invoiceId}
            id="invoice-id"
            label="Invoice ID"
            value={nextInvoiceId}
            onChange={event => setNextInvoiceId(event.target.value)}
            inputConfig={{ disabled: !invoiceIdIsEditable }}
          />
        </div>

        <div className={styles.dates}>
          <FormEl
            type="date"
            id="invoice-issue-date"
            label="Issue Date"
            value={issueDate}
            onChange={handleIssueDateChange}
          />

          <FormEl
            type="date"
            id="invoice-due-date"
            label="Due Date"
            value={dueDate}
            onChange={event => setDueDate(event.target.value)}
          />
        </div>

        <div className={styles.description}>
          <FormEl
            type="textarea"
            id="invoice-description"
            label="Description"
            value={description}
            onChange={event => setDescription(event.target.value)}
          />
        </div>
      </div>

      <button type="button" className="button button--green" onClick={handleCreate}>
        Create Invoice
      </button>
      <button type="button" className={styles.cancel} onClick={unsetInvoicing}>
        Cancel
      </button>
    </form>
  );
};

AddInvoice.propTypes = {
  subtotal: PropTypes.number,
  hours: PropTypes.number,
  tasks: PropTypes.array,
  unsetInvoicing: PropTypes.func.isRequired,
  userRef: PropTypes.object.isRequired,
  firestore: PropTypes.object.isRequired,
};

AddInvoice.defaultProps = {
  subtotal: 0,
  hours: 0,
  tasks: [],
};

export default compose(
  firestoreConnect(),
  connect(
    ({ invoice: { subtotal, hours, tasks }, userRef }) => ({ subtotal, hours, tasks, userRef }),
    dispatch => ({ unsetInvoicing: () => dispatch({ type: 'UNSET_INVOICING' }) }),
  ),
)(AddInvoice);
