import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import './ClientForm.scss';

const mapStateToProps = state => ({ clientRef: state.refs.clients });

const ClientForm = ({ clientRef }) => {
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

    clientRef.add(clientData);

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
  clientRef: PropTypes.object,
};

export default connect(mapStateToProps)(ClientForm);
