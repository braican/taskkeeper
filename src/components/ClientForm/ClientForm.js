import React, { useState } from 'react';
import { connect } from 'react-redux';
import { addClient } from '../../actions';

const mapDispatchToProps = dispatch => ({
  addClient: client => dispatch(addClient(client)),
});

const ClientForm = connect(
  null,
  mapDispatchToProps,
)(({ addClient }) => {
  const [clientName, updateClientName] = useState('');

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        addClient({ name: clientName });
      }}>
      <h2>Add new client form</h2>
      <input type="text" value={clientName} onChange={e => updateClientName(e.target.value)} />
      <input type="number" />
      <button>Add</button>
    </form>
  );
});

export default ClientForm;
