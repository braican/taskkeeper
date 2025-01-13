// app/dashboard/page.tsx
'use client';

import Button from '@/components/button';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobals } from '@/contexts/GlobalContext';
import ClientList from '@/components/client-list';
import IconPlus from '@/icons/plus';

import styles from './dashboard.module.css';

export default function Dashboard() {
  const { toggleNewClientFormVisible } = useGlobals();
  const { user } = useAuth();

  if (!user) {
    return '';
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={`${styles.headline} page-title`}>Hey, {user.name}</h1>

      <Button onClick={toggleNewClientFormVisible} icon={IconPlus}>
        Add new client
      </Button>

      <div className={styles.clientList}>
        <ClientList />
      </div>
    </div>
  );
}
