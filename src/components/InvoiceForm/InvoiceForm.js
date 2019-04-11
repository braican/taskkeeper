import React, { useState } from 'react';

import getTodaysDate from '../../util/getTodaysDate';

const InvoiceForm = () => {
  const [issueDate, setIssueDate] = useState(getTodaysDate);

  return (
    <form className="InvoiceForm">
      <label htmlFor="invoice-issue-date">Issue Date</label>
      <input
        type="date"
        id="invoice-issue-date"
        value={issueDate}
        onChange={e => setIssueDate(e.target.value)}
      />

      <label htmlFor="invoice-due-date">Due Date</label>
      <input type="date" id="invoice-due-date" />

      <label htmlFor="invoice-id">Invoice ID</label>
      <input type="text" id="invoice-id" />

      <label htmlFor="invoice-project-description">Project Description</label>
      <textarea id="invoice-project-description" cols="30" rows="2" />
    </form>
  );
};

export default InvoiceForm;
