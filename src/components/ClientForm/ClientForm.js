import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect } from 'react-redux-firebase';
import { addClient } from '../../actions';

const mapDispatchToProps = dispatch => ({
  addClient: client => dispatch(addClient(client)),
});

const ClientForm = ({ addClient }) => {
  const [clientName, updateClientName] = useState('');

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        addClient({ name: clientName });
        updateClientName('');
      }}>
      <h2>Add new client form</h2>
      <input type="text" value={clientName} onChange={e => updateClientName(e.target.value)} />
      <input type="number" />
      <button>Add</button>
    </form>
  );
};

ClientForm.propTypes = {
  auth: PropTypes.object,
  addClient: PropTypes.func,
};

export default compose(
  firebaseConnect(),
  connect(
    null,
    mapDispatchToProps,
  ),
)(ClientForm);
