import React from 'react';
import PropTypes from 'prop-types';

import Invoice from '../Invoice';

import styles from './InvoiceList.module.scss';

const InvoiceList = ({ invoices }) => {
  return (
    <section>
      <header>
        <h4>Fulfilled Invoices</h4>
      </header>

      <div className={styles.InvoiceList}>
        {invoices && invoices.map(invoice => <Invoice key={invoice.id} invoice={invoice} />)}
      </div>
    </section>
  );
};

InvoiceList.propTypes = {
  invoices: PropTypes.arrayOf(
    PropTypes.shape({
      client: PropTypes.string,
      id: PropTypes.string,
      status: PropTypes.string,
      tasks: PropTypes.arrayOf(PropTypes.string),
      timestamp: PropTypes.number,
    }),
  ),
};

export default InvoiceList;
