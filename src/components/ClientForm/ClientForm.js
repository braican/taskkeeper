import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firestoreConnect } from 'react-redux-firebase';

const mapStateToProps = state => ({ uid: state.firebase.auth.uid });

const ClientForm = ({ firestore, uid }) => {
  const [clientName, updateClientName] = useState('');

  const handleSubmit = event => {
    event.preventDefault();
    const clientData = {
      name: clientName,
    };

    firestore
      .collection('users')
      .doc(uid)
      .collection('clients')
      .add(clientData);

    updateClientName('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Add new client</h2>
      <input type="text" value={clientName} onChange={e => updateClientName(e.target.value)} />
      <input type="number" />
      <button>Add</button>
    </form>
  );
};

ClientForm.propTypes = {
  firestore: PropTypes.object,
  uid: PropTypes.string,
};

export default compose(
  firestoreConnect(),
  connect(mapStateToProps),
)(ClientForm);
