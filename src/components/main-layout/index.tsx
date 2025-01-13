'use client';

import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
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
  const clientFormRef = useRef(null);

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
      </div>

      <CSSTransition
        nodeRef={clientFormRef}
        in={isClientFormVisible}
        timeout={300}
        classNames="slideup"
        unmountOnExit
      >
        <ClientForm ref={clientFormRef} />
      </CSSTransition>
    </>
  );
}
