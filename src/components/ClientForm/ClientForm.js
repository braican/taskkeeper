import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

import './ClientForm.scss';

const mapStateToProps = state => ({ uid: state.firebase.auth.uid });

const ClientForm = ({ uid, firestore }) => {
  const [clientName, updateClientName] = useState('');
  const [clientRate, updateClientRate] = useState('');
  const [clientNameMessage, updateClientNameMessage] = useState('');
  const [clientRateMessage, updateClientRateMessage] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    let invalid = false;

    if (!clientName) {
      invalid = true;
      updateClientNameMessage('Please enter a name for this client.');
    } else {
      updateClientNameMessage('');
    }

    if (!clientRate) {
      invalid = true;
      updateClientRateMessage('Please enter an hourly rate for this client.');
    } else {
      updateClientRateMessage('');
    }

    if (invalid) {
      return;
    }

    const clientData = {
      name: clientName,
      rate: clientRate,
    };

    firestore
      .collection('users')
      .doc(uid)
      .collection('clients')
      .add(clientData);

    updateClientName('');
    updateClientRate('');
  };

  return (
    <form onSubmit={handleSubmit} className="ClientForm">
      <h4>Add new client</h4>
      <input type="text" value={clientName} onChange={e => updateClientName(e.target.value)} />
      {clientNameMessage && <p>{clientNameMessage}</p>}
      <input type="number" value={clientRate} onChange={e => updateClientRate(e.target.value)} />
      {clientRateMessage && <p>{clientRateMessage}</p>}
      <button className="action-primary add">Add</button>
    </form>
  );
};

ClientForm.propTypes = {
  uid: PropTypes.string,
  firestore: PropTypes.shape({
    collection: PropTypes.func,
  }),
};

export default compose(
  firestoreConnect(),
  connect(mapStateToProps),
)(ClientForm);
