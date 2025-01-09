'use client';

import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/sidebar';
import styles from './app.module.css';

export default function App({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isAuthenticated } = useAuth();

  return (
    <div className={styles.mainLayout}>
      {isAuthenticated && (
        <aside className={styles.aside}>
          <Sidebar />
        </aside>
      )}

      <main className={styles.main}>{children}</main>
    </div>
  );
}
