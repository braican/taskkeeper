import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { ClientContext } from '../Client';
import FormattedPrice from '../Utils/FormattedPrice';
import { getDate, getFutureDate } from '../../utils';

import FormEl from '../Forms/FormEl';

import styles from './AddInvoice.module.scss';

const AddInvoice = ({ subtotal, hours, unsetInvoicing, userRef }) => {
  const { id, symbol, nextInvoiceId, setNextInvoiceId } = useContext(ClientContext);
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
      .where('client', '==', id)
      .get()
      .then(snapshot => {
        let invoiceCount = 0;
        snapshot.forEach(doc => {
          const { invoiceId: invId } = doc.data();
          if (invId) {
            const invNumber = parseInt(invId.replace(`${symbol}-`, '', invId));

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

      <button type="button" className="button button--green">
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
  unsetInvoicing: PropTypes.func.isRequired,
  userRef: PropTypes.object.isRequired,
};

export default compose(
  connect(
    ({ invoice: { subtotal, hours }, userRef }) => ({ subtotal, hours, userRef }),
    dispatch => ({ unsetInvoicing: () => dispatch({ type: 'UNSET_INVOICING' }) }),
  ),
)(AddInvoice);
