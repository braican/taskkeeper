// app/dashboard/page.tsx
'use client';

import Button from '@/components/button';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobals } from '@/contexts/GlobalContext';
import ClientList from '@/components/client-list';
import IconPlus from '@/icons/plus';

import styles from './dashboard.module.css';
import Stats from '@/components/stats';

export default function Dashboard() {
  const { toggleClientFormVisible } = useGlobals();
  const { user } = useAuth();

  if (!user) {
    return '';
  }

  return (
    <div className={styles.dashboard}>
      <h1 className={`${styles.headline} page-title`}>Hey, {user.name}</h1>

      <Button onClick={() => toggleClientFormVisible()} icon={IconPlus}>
        Add new client
      </Button>

      <div className={styles.main}>
        <div>
          <ClientList />
        </div>
        <div className={styles.stats}>
          <Stats />
        </div>
      </div>
    </div>
  );
}
