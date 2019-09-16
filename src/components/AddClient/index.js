import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import FormEl from '../Forms/FormEl';

import styles from './AddClient.module.scss';

const AddClient = ({ hideAddClient, userRef }) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [rate, setRate] = useState(0);
  const [address, setAddress] = useState('');

  const handleSubmit = event => {
    event.preventDefault();

    if (!userRef) {
      return;
    }

    // Replace line breaks with <br> tags.
    const newAddress = address.replace(/\n/g, '<br>', address);

    const clientData = {
      name,
      symbol,
      rate: parseFloat(rate),
      address: newAddress,
    };

    userRef
      .collection('clients')
      .add(clientData)
      .catch(e => console.error('There was an error adding a client:', e));
    setName('');
    setSymbol('');
    setRate(0);
    setAddress('');
    hideAddClient();
  };

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <header className={styles.header}>
          <h2 className="page-header">Add new client</h2>
        </header>
        <div className={styles.form__main}>
          <FormEl
            id="new-client-name"
            label="Name"
            value={name}
            className={styles.input__name}
            inputConfig={{ placeholder: 'Client Name' }}
            onChange={event => setName(event.target.value)}
          />

          <div className={styles.secondary}>
            <FormEl
              id="new-client-symbol"
              label="Client ID"
              value={symbol}
              inputConfig={{ placeholder: 'Like TST' }}
              onChange={event => setSymbol(event.target.value)}
            />
            <FormEl
              id="new-client-rate"
              type="number"
              label="Hourly Rate"
              value={rate}
              className={styles.input__rate}
              onChange={event => setRate(event.target.value)}
            />
            <FormEl
              id="new-client-address"
              type="textarea"
              label="Address"
              value={address}
              className={styles.input__address}
              onChange={event => setAddress(event.target.value)}
            />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="submit" className="button">
            Add Client
          </button>
          <button type="button" onClick={hideAddClient}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

AddClient.propTypes = {
  hideAddClient: PropTypes.func.isRequired,
  userRef: PropTypes.object,
};

AddClient.defaultProps = {
  userRef: null,
};

export default connect(
  ({ userRef }) => ({ userRef }),
  dispatch => ({
    hideAddClient: () => dispatch({ type: 'HIDE_ADD_CLIENT' }),
  }),
)(AddClient);
