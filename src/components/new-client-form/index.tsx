import Button from '@/components/button';
import { useGlobals } from '@/contexts/GlobalContext';

import styles from './new-client-form.module.css';

export default function NewClientForm({
  className = '',
}: {
  className?: string;
}) {
  const { toggleNewClientFormVisible } = useGlobals();

  return (
    <form className={`${styles.form} ${className}`}>
      <div>
        <label htmlFor="client_name">Client</label>
        <input type="text" id="client_name" />
      </div>
      <div>
        <label htmlFor="client_key">Client key</label>
        <input type="text" id="client_key" />
      </div>
      <div>
        <label htmlFor="client_rate">Rate</label>
        <input type="number" id="client_rate" />
      </div>
      <div>
        <label htmlFor="client_address">Address</label>
        <textarea id="client_address" rows={2}></textarea>
      </div>

      <div>
        <Button type="button" onClick={toggleNewClientFormVisible}>
          Close
        </Button>
      </div>
    </form>
  );
}
