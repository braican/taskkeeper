import React, { useState } from 'react';
import { useAuth, useClients } from 'hooks';
import { post } from 'util/index';
import Button from 'components/ui/Button';
import FormInput from 'components/ui/FormInput';
import Icon from 'components/ui/Icon';

import styles from './AddClient.module.scss';

const ClientList = () => {
  const [formActive, setFormActive] = useState(false);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [rate, setRate] = useState('');
  const [address, setAddress] = useState('');
  const { userData } = useAuth();
  const { addClient } = useClients();

  const addClientToDb = () => {
    post('addClient', {
      secret: userData.secret,
      client: { name, key, rate, address },
    })
      .then(({ client }) => {
        addClient(client);
        setFormActive(false);
      })
      .catch(console.error);
  };

  if (formActive) {
    return (
      <form onSubmit={event => event.preventDefault()} className={styles.form}>
        <FormInput
          label="Client"
          name="client_name"
          placeholder="Client"
          onChange={event => setName(event.target.value)}
        />

        <FormInput
          label="Client Key"
          name="client_key"
          placeholder="Key (like TST)"
          onChange={event => setKey(event.target.value)}
        />
        <FormInput
          label="Rate"
          type="number"
          name="client_rate"
          placeholder="Rate"
          onChange={event => setRate(event.target.value)}
        />

        <FormInput
          label="Address"
          type="textarea"
          name="client_address"
          onChange={event => setAddress(event.target.value)}
        />

        <div className={styles.actions}>
          <Button onClick={addClientToDb}>Add</Button>
          <button type="button" onClick={() => setFormActive(false)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <button onClick={() => setFormActive(true)} className={styles.addNew}>
      <Icon viewBox="0 0 24 28" icon="plus-square" />
      <span>Add new</span>
    </button>
  );
};

export default ClientList;
