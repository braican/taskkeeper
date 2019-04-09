import React from 'react';
import PropTypes from 'prop-types';

import Invoice from '../Invoice';

const InvoiceList = ({ invoices, header }) => {
  return (
    <section>
      <header>
        <h4>{header}</h4>
      </header>

      <div>
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
  header: PropTypes.string,
};

export default InvoiceList;
