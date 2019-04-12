import React from 'react';
import PropTypes from 'prop-types';

import Invoice from '../Invoice';

import styles from './ActiveInvoices.module.scss';

const ActiveInvoices = ({ invoices }) => {
  return (
    <section>
      <header>
        <h4>Active Invoices</h4>
      </header>

      <div className={styles.ActiveInvoices}>
        {invoices && invoices.map(invoice => <Invoice key={invoice.id} invoice={invoice} />)}
      </div>
    </section>
  );
};

ActiveInvoices.propTypes = {
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

export default ActiveInvoices;
