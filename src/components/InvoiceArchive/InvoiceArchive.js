import React from 'react';
import PropTypes from 'prop-types';

import Invoice from '../Invoice';

import styles from './InvoiceArchive.module.scss';

const InvoiceList = ({ invoices }) => {
  return (
    <section className={styles.InvoiceArchive}>
      <header>
        <h4>Fulfilled Invoices</h4>
      </header>

      {invoices && invoices.length > 0 ? (
        <div className={styles.archiveGrid}>
          {invoices.map(invoice => (
            <Invoice key={invoice.id} invoice={invoice} display="grid" />
          ))}
        </div>
      ) : (
        <p>No fulfilled invoices yet.</p>
      )}
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
