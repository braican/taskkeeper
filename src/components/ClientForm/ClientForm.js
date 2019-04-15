import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Plus from '../../svg/plus';

import styles from './ClientForm.module.scss';

const mapStateToProps = state => ({ clientRef: state.refs.clients });

const ClientForm = ({ clientRef }) => {
  const [clientName, setClientName] = useState('');
  const [clientRate, setClientRate] = useState('');
  const [clientSymbol, setClientSymbol] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientNameMessage, setClientNameMessage] = useState('');
  const [clientRateMessage, setClientRateMessage] = useState('');
  const [clientFormVisible, setClientFormVisibility] = useState(false);

  const handleSubmit = event => {
    event.preventDefault();
    let invalid = false;

    if (!clientName) {
      invalid = true;
      setClientNameMessage('Please enter a name for this client.');
    } else {
      setClientNameMessage('');
    }

    if (!clientRate) {
      invalid = true;
      setClientRateMessage('Please enter an hourly rate for this client.');
    } else {
      setClientRateMessage('');
    }

    if (invalid) {
      return;
    }

    clientRef.add({
      name: clientName,
      rate: clientRate,
      symbol: clientSymbol,
      address: clientAddress,
    });

    setClientName('');
    setClientRate('');
    setClientSymbol('');
    setClientAddress('');
  };

  return (
    <>
      <button className={styles.addNewClient} onClick={() => setClientFormVisibility(true)}>
        <span>Add new client</span>
        <Plus />
      </button>

      <div className={`${styles.ClientForm} ${clientFormVisible ? styles.ClientForm_active : ''}`}>
        <header>
          <h4>Add new client</h4>
        </header>

        <form className={styles.addNewForm} onSubmit={handleSubmit}>
          <div className={styles.formEl}>
            <label htmlFor="client-name">Name</label>
            <input
              type="text"
              id="client-name"
              value={clientName}
              onChange={e => setClientName(e.target.value)}
            />
            {clientNameMessage && <p>{clientNameMessage}</p>}
          </div>

          <div className={styles.formEl}>
            <label htmlFor="client-rate">Hourly Rate</label>
            <input
              type="number"
              id="client-rate"
              value={clientRate}
              onChange={e => setClientRate(e.target.value)}
            />
            {clientRateMessage && <p>{clientRateMessage}</p>}
          </div>

          <div className={styles.formEl}>
            <label
              htmlFor="client-symbol"
              title="Add a unique identifying symbol for this client to be used in invoices.">
              Symbol
            </label>
            <input
              type="text"
              id="client-symbol"
              value={clientSymbol}
              maxLength="3"
              onChange={e => setClientSymbol(e.target.value)}
            />
          </div>

          <div className={styles.formEl}>
            <label htmlFor="client-address">Address</label>
            <textarea
              id="client-address"
              value={clientAddress}
              onChange={e => setClientAddress(e.target.value)}
              rows="2"
              resize="false"
            />
          </div>

          <div className={styles.formActions}>
            <button className={`action-primary action--white ${styles.addClientBtn}`}>Add</button>
            <button
              className="action-secondary action--white"
              onClick={e => {
                e.preventDefault();
                setClientFormVisibility(false);
              }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

ClientForm.propTypes = {
  clientRef: PropTypes.object,
};

export default connect(mapStateToProps)(ClientForm);
