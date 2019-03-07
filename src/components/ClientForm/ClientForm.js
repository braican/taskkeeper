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

  const handleSubmit = event => {
    event.preventDefault();
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
      <input type="number" value={clientRate} onChange={e => updateClientRate(e.target.value)} />
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
