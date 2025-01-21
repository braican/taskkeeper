import { useEffect, useState } from 'react';
import { useGlobals } from '@/contexts/GlobalContext';
import SlideUpModalForm from '@/components/slide-up-modal-form';
import { useClients } from '@/contexts/ClientContext';
import { Client } from '@/types';

export default function ClientForm() {
  const { isClientFormVisible, toggleClientFormVisible, clientToEdit } =
    useGlobals();
  const { addClient, updateClient } = useClients();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [rate, setRate] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const clearForm = () => {
    setName('');
    setKey('');
    setRate('');
    setAddress('');
    setError('');
  };

  useEffect(() => {
    if (clientToEdit) {
      setName(clientToEdit.name);
      setKey(clientToEdit.key);
      setRate(clientToEdit.rate.toString());
      setAddress(clientToEdit.address);
    } else {
      clearForm();
    }
  }, [clientToEdit]);

  useEffect(() => {
    if (!toggleClientFormVisible) {
      clearForm();
    }
  }, [toggleClientFormVisible]);

  const handleSubmit = async () => {
    setError('');

    if (!name) {
      setError('You must supply a client name.');
      return;
    }

    try {
      const newData: Omit<Client, 'id'> = {
        name,
        key,
        rate: Number(rate),
        address,
      };
      if (clientToEdit) {
        await updateClient({ ...newData, id: clientToEdit.id });
      } else {
        await addClient(newData);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to save client.');
    } finally {
      toggleClientFormVisible();
    }
  };

  return (
    <SlideUpModalForm
      visible={isClientFormVisible}
      title={clientToEdit ? `Editing ${clientToEdit.name}` : 'Add client'}
      onSubmit={handleSubmit}
      onCancel={toggleClientFormVisible}
    >
      <>
        {error && <div className="form-error-message">{error}</div>}

        <div className="form-row">
          <label className="form-label" htmlFor="client_name">
            Client
          </label>
          <input
            className="form-input"
            type="text"
            id="client_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="client_key">
            Client key
          </label>
          <input
            className="form-input"
            type="text"
            id="client_key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="client_rate">
            Rate
          </label>
          <input
            className="form-input"
            type="number"
            id="client_rate"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
          />
        </div>
        <div className="form-row">
          <label className="form-label" htmlFor="client_address">
            Address
          </label>
          <textarea
            className="form-input"
            id="client_address"
            rows={2}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          ></textarea>
        </div>
      </>
    </SlideUpModalForm>
  );
}
