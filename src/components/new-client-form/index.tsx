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
  const { toggleNewClientFormVisible } = useGlobals();
  const [name, setName] = useState('');
  const [key, setKey] = useState('');
  const [rate, setRate] = useState('');
  const [address, setAddress] = useState('');

  const saveClient = () => {
    console.log('save iot');
    console.log(name, key, rate, address);
  };

  return (
    <form className={`${styles.form} ${className}`} ref={ref}>
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
        <Button type="button" onClick={saveClient}>
          Save
        </Button>
      </div>
    </form>
  );
}
