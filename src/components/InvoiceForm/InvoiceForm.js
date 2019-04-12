import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import ClientContext from '../../contexts/ClientContext';
import TaskListContext from '../../contexts/TaskListContext';

import getDate from '../../util/getDate';
import computeTotal from '../../util/computeTotal';
import computeHours from '../../util/computeHours';
import formatPrice from '../../util/formatPrice';

import styles from './InvoiceForm.module.scss';

const mapStateToProps = state => ({
  taskRef: state.refs.tasks,
  invoiceRef: state.refs.invoices,
});

const InvoiceForm = ({ selectedTasks, firestore, taskRef, invoiceRef }) => {
  const [issueDate, setIssueDate] = useState(getDate());
  const [dueDate, setDueDate] = useState(getDate(30));
  const [invoiceId, setInvoiceId] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const { clientId } = useContext(ClientContext);
  const { setCreatingInvoice, setSelectedTasks } = useContext(TaskListContext);
  const displayPrice = computeTotal(selectedTasks) || 0;
  const displayHours = computeHours(selectedTasks) || 0;

  const createInvoice = () => {
    if (selectedTasks.length === 0) {
      console.error('You need to select at least one task to invoice.');
      return;
    }
    const selectedTaskIds = selectedTasks.map(task => task.id);
    const batch = firestore.batch();
    selectedTaskIds.forEach(taskId => {
      const singleTaskRef = taskRef.doc(taskId);
      batch.update(singleTaskRef, { status: 'invoiced' });
    });
    batch.commit();
    invoiceRef.add({
      invoiceId,
      client: clientId,
      status: 'active',
      issueDate,
      dueDate,
      projectDescription,
      price: displayPrice,
      hours: displayHours,
      tasks: selectedTaskIds,
      timestamp: +new Date(),
    });

    setCreatingInvoice(false);
    setSelectedTasks([]);
  };

  return (
    <form className={styles.InvoiceForm}>
      <div className={styles.invoiceData}>
        <p className={styles.invoicedPrice}>{formatPrice(displayPrice)}</p>
        <p className={styles.invoiceHours}>{displayHours} hours</p>
      </div>
      <div className={styles.formInputs}>
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
          <input
            type="date"
            id="invoice-due-date"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
          />
        </div>

        <div className={styles.formEl}>
          <label htmlFor="invoice-id">Invoice ID</label>
          <input
            type="text"
            id="invoice-id"
            value={invoiceId}
            onChange={e => setInvoiceId(e.target.value)}
          />
        </div>
        <div className={`${styles.formEl} ${styles.formElDescription}`}>
          <label htmlFor="invoice-project-description">Project Description</label>
          <textarea
            id="invoice-project-description"
            cols="30"
            rows="2"
            value={projectDescription}
            onChange={e => setProjectDescription(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <button
          className={`${styles.actionCancel} action-secondary`}
          type="button"
          onClick={() => setCreatingInvoice(false)}>
          Cancel
        </button>
        <button
          className="action-primary"
          type="button"
          onClick={createInvoice}
          disabled={selectedTasks.length === 0}>
          Create Invoice
        </button>
      </div>
    </form>
  );
};

InvoiceForm.propTypes = {
  selectedTasks: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
  firestore: PropTypes.object,
  taskRef: PropTypes.object,
  invoiceRef: PropTypes.object,
};

export default compose(
  firestoreConnect(),
  connect(mapStateToProps),
)(InvoiceForm);
