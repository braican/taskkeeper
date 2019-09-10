import React from 'react';
import PropTypes from 'prop-types';

import Invoice from '../../Invoice';

import styles from './ActiveInvoices.module.scss';

const ActiveInvoices = ({ invoices, tasks }) => {
  if (!invoices || invoices.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <header>
        <h3 className="section-header">Active Invoices</h3>
      </header>

      <div className={styles.invoiceList}>
        {invoices.map(invoice => {
          const invoiceTasks = invoice.tasks.map(taskId => tasks[taskId]);
          return (
            <div key={invoice.id} className={styles.invoice}>
              <Invoice invoice={invoice} tasks={invoiceTasks} />
            </div>
          );
        })}
      </div>
    </section>
  );
};

ActiveInvoices.propTypes = {
  invoices: PropTypes.array,
  tasks: PropTypes.object,
};

ActiveInvoices.defaultProps = {
  invoices: [],
  tasks: {},
};

export default ActiveInvoices;
