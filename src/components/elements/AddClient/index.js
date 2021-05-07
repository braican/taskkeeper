import React, { useEffect, useState } from 'react';
import { useAuth } from 'hooks';
import { post, cancellablePromise } from 'util/index';
import Button from 'components/ui/Button';

import styles from './AddClient.module.scss';

const ClientList = () => {
  const [formActive, setFormActive] = useState(false);
  const [name, setName] = useState('');
  const [id, setId] = useState('');
  const [rate, setRate] = useState('');
  const [address, setAddress] = useState('');
  const { userData } = useAuth();

  const addClient = async () => {
    try {
      console.log(name, id, rate, address);
      // return await post('getClients', { secret: userData.secret });
    } catch (e) {
      console.error(e);
    }
  };

  if (formActive) {
    return (
      <form onSubmit={event => event.preventDefault()}>
        <input
          type="text"
          name="client_name"
          placeholder="Client"
          onChange={event => setName(event.target.value)}
        />
        <input
          type="text"
          name="client_id"
          placeholder="ID (like TST)"
          onChange={event => setId(event.target.value)}
        />
        <input
          type="text"
          name="client_rate"
          placeholder="Rate"
          onChange={event => setRate(event.target.value)}
        />
        <textarea name="client_address" onChange={event => setAddress(event.target.value)} />

        <div>
          <Button onClick={addClient}>Add</Button>
          <button onClick={() => setFormActive(false)}>Cancel</button>
        </div>
      </form>
    );
  }

  return <Button onClick={() => setFormActive(true)}>Add a new client</Button>;
};

export default ClientList;
