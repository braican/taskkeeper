import React from 'react';
import PropTypes from 'prop-types';
import { currencyFormatter, formatDate } from 'util/index';

import styles from './PaidInvoice.module.scss';

const PaidInvoice = ({ invoice }) => {
  const hours = invoice.tasks.reduce(
    (total, { hours }) => (hours ? parseFloat(hours) + total : total),
    0,
  );

  return (
    <article>
      <dl>
        <dt className={styles.labels}>Invoice ID</dt>
        <dd className={styles.id}>{invoice.invoiceId}</dd>

        <dt className={styles.labels}>Issued</dt>
        <dd className={styles.id}>Issued {formatDate(invoice.issued)}</dd>

        <dt className={styles.labels}>Total</dt>
        <dd className={styles.total}>{currencyFormatter.format(invoice.total)}</dd>

        <dt className={styles.labels}>Hours</dt>
        <dd className={styles.hours}>{hours ? `${hours} hours` : ''}</dd>

        {invoice.description && (
          <>
            <dt className={styles.labels}>Description</dt>
            <dd className={styles.descriptionText}>{invoice.description}</dd>
          </>
        )}
      </dl>
    </article>
  );
};

PaidInvoice.propTypes = {
  invoice: PropTypes.shape({
    total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    rate: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    invoiceId: PropTypes.string,
    issued: PropTypes.string,
    due: PropTypes.string,
    description: PropTypes.string,
    tasks: PropTypes.array,
    client: PropTypes.string,
  }),
};

export default PaidInvoice;
