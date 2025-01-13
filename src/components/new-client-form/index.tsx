import { useState, RefObject } from 'react';
import Button from '@/components/button';
import { useGlobals } from '@/contexts/GlobalContext';

import styles from './new-client-form.module.css';

export default function NewClientForm({
  className = '',
  ref = null,
}: {
  className?: string;
  ref?: RefObject<null> | null;
}) {
  const { toggleNewClientFormVisible, addClient } = useGlobals();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [rate, setRate] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await addClient({ name, key, rate: Number(rate), address });
    } catch (err) {
      console.error(err);
      setError('Failed to save client. Please try again.');
    } finally {
      setIsSubmitting(false);
      toggleNewClientFormVisible();
    }
  };

  return (
    <form
      className={`${styles.form} ${className}`}
      ref={ref}
      onSubmit={handleSubmit}
    >
      {error && <div className="error-message">{error}</div>}

      <div className="form-item">
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
      <div className="form-item">
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
      <div className="form-item">
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
      <div className="form-item">
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

      <div className={`${styles.formActions} form-item`}>
        <Button
          type="button"
          onClick={toggleNewClientFormVisible}
          style="secondary"
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}
