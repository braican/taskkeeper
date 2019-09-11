import React from 'react';
import PropTypes from 'prop-types';

import Invoice from '../../Invoice/Archived';

import styles from './ArchivedInvoices.module.scss';

const ArchiveInvoices = ({ invoices }) => {
  if (!invoices || invoices.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <header>
        <h3 className="section-header">Older Invoices</h3>
      </header>

      <ul className={styles.invoiceList}>
        {invoices.map(invoice => (
          <li key={invoice.id} className={styles.invoice}>
            <Invoice invoice={invoice} />
          </li>
        ))}
      </ul>
    </section>
  );
};

ArchiveInvoices.propTypes = {
  invoices: PropTypes.array,
};

ArchiveInvoices.defaultProps = {
  invoices: [],
};

export default ArchiveInvoices;
