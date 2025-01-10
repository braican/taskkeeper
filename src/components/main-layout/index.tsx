'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useGlobals } from '@/contexts/GlobalContext';
import Sidebar from '@/components/sidebar';
import NewClientForm from '@/components/new-client-form';
import styles from './main-layout.module.css';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const { isNewClientFormVisible } = useGlobals();

  return (
    <>
      <div className={styles.mainLayout}>
        {isAuthenticated && (
          <aside className={styles.aside}>
            <Sidebar />
          </aside>
        )}

        <main className={styles.main}>{children}</main>
        {isNewClientFormVisible && <NewClientForm />}
      </div>
    </>
  );
}
