import React, { useEffect, useState } from 'react';
import { useAuth, useClients } from 'hooks';
import { post } from 'util/index';
import Button from 'components/ui/Button';
import FormInput from 'components/ui/FormInput';

import styles from './AddClient.module.scss';

const ClientList = () => {
  const [formActive, setFormActive] = useState(false);
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [rate, setRate] = useState('');
  const [address, setAddress] = useState('');
  const { userData } = useAuth();
  const { clients, setClients } = useClients();

  const addClient = () => {
    post('addClient', {
      secret: userData.secret,
      client: { name, key, rate, address },
    })
      .then(({ client }) => {
        const newClients = [...clients, client];
        setClients(newClients);
        setFormActive(false);
      })
      .catch(console.error);
  };

  if (formActive) {
    return (
      <form onSubmit={event => event.preventDefault()}>
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
          type="textarea"
          name="client_address"
          onChange={event => setAddress(event.target.value)}
        />

        <div>
          <Button onClick={addClient}>Add</Button>
          <button type="button" onClick={() => setFormActive(false)}>
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return <Button onClick={() => setFormActive(true)}>Add a new client</Button>;
};

export default ClientList;
