import React from 'react';
import PropTypes from 'prop-types';

// import Invoice from '../../Invoice';

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

      <div className={styles.invoiceList}>
        {invoices.map(invoice => {
          return (
            <div key={invoice.id} className={styles.invoice}>
              {invoice.id}
            </div>
          );
        })}
      </div>
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
