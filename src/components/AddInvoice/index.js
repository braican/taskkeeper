import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';

import styles from './AddInvoice.module.scss';

const AddInvoice = ({ subtotal, hours, unsetInvoicing }) => {
  return (
    <form>
      <h2>{subtotal}</h2>
      <h2>{hours}</h2>
      <button type="button" onClick={unsetInvoicing}>
        Cancel
      </button>
      <button type="button">Create Invoice</button>
    </form>
  );
};

AddInvoice.propTypes = {
  unsetInvoicing: PropTypes.func.isRequired,
};

export default compose(
  connect(
    ({ invoice: { subtotal, hours } }) => ({ subtotal, hours }),
    dispatch => ({ unsetInvoicing: () => dispatch({ type: 'UNSET_INVOICING' }) }),
  ),
)(AddInvoice);
