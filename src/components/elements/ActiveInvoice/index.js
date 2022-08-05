import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useAuth, useInvoices, useClients } from 'hooks';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePdf from '../../../views/InvoicePdf';
import { currencyFormatter, currencyFormatterFull, formatDate } from 'util/index';

import Button from '../../ui/Button';
import Icon from '../../ui/Icon';

import { INVOICE_STATUS } from 'constants.js';

import styles from './ActiveInvoice.module.scss';

const ActiveInvoice = ({ invoice }) => {
  const { post } = useAuth();
  const { updateInvoice } = useInvoices();
  const [showTasks, setShowTasks] = useState(false);
  const { clients } = useClients();

  if (!invoice) {
    return null;
  }

  const client = clients[invoice.client];

  const hours = invoice.tasks.reduce(
    (total, { hours }) => (hours ? parseFloat(hours) + total : total),
    0,
  );

  const markAsPaid = () =>
    post('updateInvoice', { ...invoice, status: INVOICE_STATUS.paid }).then(({ invoice }) =>
      updateInvoice(invoice),
    );

  const filename = `invoice-${invoice.invoiceId.replace('-', '_').toLowerCase()}.pdf`;

  return (
    <article className={styles.invoice}>
      <div className={styles.meta}>
        <span className={styles.id}>{invoice.invoiceId}</span>

        <dl>
          <dt className={styles.label}>Issued</dt>
          <dd className={styles.value}>{formatDate(invoice.issued)}</dd>

          <dt className={styles.label}>Due</dt>
          <dd className={styles.value}>{formatDate(invoice.due)}</dd>
        </dl>
      </div>
      <div>
        <span className={styles.total}>{currencyFormatter.format(invoice.total)}</span>
        <span className={styles.hours}>{hours ? `${hours} hours` : ''}</span>
      </div>
      <div className={styles.description}>
        {invoice.description && <p className={styles.descriptionText}>{invoice.description}</p>}

        <button
          className={classnames(styles.taskToggle, showTasks ? styles.taskToggleFlipped : '')}
          onClick={() => setShowTasks(!showTasks)}
          title={`${showTasks ? 'Hide' : 'Show'} tasks`}>
          <Icon
            viewBox="0 0 20 20"
            icon="cheveron-down"
            label={`${showTasks ? 'Hide' : 'Show'} tasks`}
            inline
          />
        </button>
      </div>

      {showTasks && (
        <ul className={styles.tasks}>
          {invoice.tasks.map(task => {
            const hours = task.hours || 0;
            const total = task.price || parseFloat(hours) * parseFloat(invoice.rate);

            return (
              <li key={task.id} className={styles.task}>
                <span>{task.description}</span>
                <span>{hours > 0 ? `${hours} hrs` : ''}</span>
                <span className={styles.taskTotal}>
                  {parseFloat(total) < 0
                    ? `(${currencyFormatterFull.format(Math.abs(total))})`
                    : currencyFormatterFull.format(total)}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      <div className={styles.download}>
        <PDFDownloadLink
          document={<InvoicePdf invoice={invoice} client={client} />}
          fileName={filename}
          className={styles.downloadButton}>
          {({ loading }) => (
            <Icon
              viewBox="0 0 24 24"
              icon="download"
              label="Download"
              inline
              className={loading ? styles.downloadButtonLoading : ''}
            />
          )}
        </PDFDownloadLink>
      </div>

      <div className={styles.action}>
        <Button style={['fullwidth', 'green']} onClick={markAsPaid}>
          Paid
        </Button>
      </div>
    </article>
  );
};

ActiveInvoice.propTypes = {
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

export default ActiveInvoice;
