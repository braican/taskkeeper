import { useState } from 'react';
import { useGlobals } from '@/contexts/GlobalContext';
import SlideUpModalForm from '@/components/slide-up-modal-form';

export default function ClientForm() {
  const {
    isClientFormVisible,
    toggleClientFormVisible,
    addClient,
    updateClient,
    clientToEdit,
  } = useGlobals();
  const [name, setName] = useState(clientToEdit ? clientToEdit.name : '');
  const [key, setKey] = useState(clientToEdit ? clientToEdit.key : '');
  const [rate, setRate] = useState(clientToEdit ? clientToEdit.rate : '');
  const [address, setAddress] = useState(
    clientToEdit ? clientToEdit.address : '',
  );

  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');

    try {
      const newData = { name, key, rate: Number(rate), address };
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
        {error && <div className="error-message">{error}</div>}

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
