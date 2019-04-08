import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';

import TaskListContext from '../../contexts/TaskListContext';

import CompleteIcon from '../../svg/complete';

const TaskRowHeader = ({ setInvoiceAll }) => {
  const [invoiceAll, markInvoiceAll] = useState(false);
  const { creatingInvoice } = useContext(TaskListContext);

  return (
    <li className={`TaskRow row header${creatingInvoice ? ' can-invoice' : ''}`}>
      <div className="wrapper">
        <span className="cell description">Description</span>
        <span className="cell hours">Hours</span>
        <span className="cell price">Price</span>
      </div>

      {setInvoiceAll && (
        <div className={`toggle-invoiceable${creatingInvoice ? ' active' : ''}`}>
          <button
            className={`invoiceable-control${invoiceAll ? ' selected' : ''}`}
            onClick={() => {
              markInvoiceAll(!invoiceAll);
              setInvoiceAll(true);
            }}>
            <span>
              <CompleteIcon />
            </span>
          </button>
        </div>
      )}
    </li>
  );
};

TaskRowHeader.propTypes = {
  setInvoiceAll: PropTypes.func,
};

export default TaskRowHeader;
