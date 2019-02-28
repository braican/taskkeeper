import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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
      }}>
      <h2>Add new client form</h2>
      <input type="text" value={clientName} onChange={e => updateClientName(e.target.value)} />
      <input type="number" />
      <button>Add</button>
    </form>
  );
};

ClientForm.propTypes = {
  addClient: PropTypes.func,
};

export default connect(
  null,
  mapDispatchToProps,
)(ClientForm);
