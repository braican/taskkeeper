import React, { useState } from 'react';
import { useAuth, useClients } from 'hooks';
import { post } from 'util/index';
import FormModal from 'components/elements/FormModal';

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
    if (!name) {
      return;
    }

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
      <FormModal
        onSubmit={addClientToDb}
        onCancel={() => setFormActive(false)}
        headline="Add new client">
        <FormInput
          label="Client"
          name="client_name"
          value={name}
          required
          onChange={event => setName(event.target.value)}
        />

        <FormInput
          label="Client Key"
          name="client_key"
          value={key}
          onChange={event => setKey(event.target.value)}
        />
        <FormInput
          label="Rate"
          type="number"
          name="client_rate"
          value={rate}
          onChange={event => setRate(event.target.value)}
        />

        <FormInput
          label="Address"
          type="textarea"
          name="client_address"
          value={address}
          onChange={event => setAddress(event.target.value)}
        />
      </FormModal>
    );
  }

  return (
    <button onClick={() => setFormActive(true)} className={styles.addNew}>
      <Icon viewBox="0 0 24 28" icon="plus-square" />
      <span>Add client</span>
    </button>
  );
};

export default ClientList;
