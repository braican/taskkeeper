'use client';

import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
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
  const newClientFormRef = useRef(null);

  return (
    <>
      <div
        className={`${styles.mainLayout} ${isNewClientFormVisible ? styles.modalOverlay : ''}`}
      >
        {isAuthenticated && (
          <aside className={styles.aside}>
            <Sidebar />
          </aside>
        )}

        <main className={styles.main}>{children}</main>
      </div>

      <CSSTransition
        nodeRef={newClientFormRef}
        in={isNewClientFormVisible}
        timeout={300}
        classNames="slideup"
        unmountOnExit
      >
        <NewClientForm ref={newClientFormRef} />
      </CSSTransition>
    </>
  );
}
