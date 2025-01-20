'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import UserNav from '@/components/user-nav';
import { useClients } from '@/contexts/ClientContext';
import pb from '@/lib/pocketbase';
import IconMenu from '@/icons/menu';
import styles from './sidebar.module.css';

export default function Sidebar() {
  const pathname = usePathname();
  const { clients, areClientsLoaded } = useClients();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const avatar = user ? pb.files.getURL(user, user.avatar) : null;

  // Close the side menu whenever the route changes.
  useEffect(() => {
    setSideMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleMobileMenu = () => {
    setSideMenuOpen(!sideMenuOpen);
  };

  return (
    <div
      className={`${styles.sidebar} ${sideMenuOpen ? styles.sideMenuOpen : null}`}
    >
      <header className={styles.header} ref={menuRef}>
        <p className="sr-only">Taskkeeper</p>

        {user && (
          <>
            <button className={styles.avatarFigure} onClick={toggleUserMenu}>
              <figure>
                {avatar ? (
                  <Image
                    width="48"
                    height="48"
                    style={{ width: 'auto' }}
                    src={avatar}
                    alt="User avatar"
                  />
                ) : (
                  <span className={styles.avatarPlaceholder}>
                    {user.name.charAt(0)}
                  </span>
                )}
              </figure>
            </button>
          </>
        )}

        <button
          className={styles.mobileMenuToggle}
          onClick={toggleMobileMenu}
          aria-label={sideMenuOpen ? 'Close menu' : 'Open menu'}
        >
          <IconMenu />
        </button>

        {userMenuOpen && <UserNav />}
      </header>

      <div className={styles.sidebarNav}>
        {areClientsLoaded && clients && (
          <>
            <h3 className="uppercase-header">clients</h3>

            <ul className={`ul-reset ${styles.clientList}`}>
              {clients.map((client) => (
                <li key={client.id} className={styles.clientItem}>
                  <Link
                    href={`/client/${client.id}`}
                    className={
                      pathname === `/client/${client.id}`
                        ? styles.activeClientLink
                        : ''
                    }
                  >
                    {client.name}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}
