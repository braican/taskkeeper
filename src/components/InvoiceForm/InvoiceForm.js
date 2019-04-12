import React, { useState } from 'react';

import getTodaysDate from '../../util/getTodaysDate';

import styles from './InvoiceForm.module.scss';

const InvoiceForm = () => {
  const [issueDate, setIssueDate] = useState(getTodaysDate);

  return (
    <form className={styles.InvoiceForm}>
      <div className={styles.formEl}>
        <label htmlFor="invoice-issue-date">Issue Date</label>
        <input
          type="date"
          id="invoice-issue-date"
          value={issueDate}
          onChange={e => setIssueDate(e.target.value)}
        />
      </div>
      <div className={styles.formEl}>
        <label htmlFor="invoice-due-date">Due Date</label>
        <input type="date" id="invoice-due-date" />
      </div>

      <div className={styles.formEl}>
        <label htmlFor="invoice-id">Invoice ID</label>
        <input type="text" id="invoice-id" />
      </div>
      <div className={`${styles.formEl} ${styles.formElDescription}`}>
        <label htmlFor="invoice-project-description">Project Description</label>
        <textarea id="invoice-project-description" cols="30" rows="2" />
      </div>
    </form>
  );
};

export default InvoiceForm;
