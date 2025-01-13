'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useGlobals } from '@/contexts/GlobalContext';
import Sidebar from '@/components/sidebar';
import ClientForm from '@/components/client-form';
import styles from './main-layout.module.css';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const { isClientFormVisible } = useGlobals();

  return (
    <>
      <div
        className={`${styles.mainLayout} ${isClientFormVisible ? styles.modalOverlay : ''}`}
      >
        {isAuthenticated && (
          <aside className={styles.aside}>
            <Sidebar />
          </aside>
        )}

        <main className={styles.main}>{children}</main>

        <ClientForm />
      </div>
    </>
  );
}
