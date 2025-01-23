// app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/button';
import { useAuth } from '@/contexts/AuthContext';
import { useGlobals } from '@/contexts/GlobalContext';
import ClientList from '@/components/client-list';
import Stats from '@/components/stats';
import IconPlus from '@/icons/plus';

import styles from './dashboard.module.css';

export default function Dashboard() {
  const { toggleClientFormVisible } = useGlobals();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

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
