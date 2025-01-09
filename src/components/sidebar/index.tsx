'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import UserNav from '@/components/user-nav';
import pb from '@/lib/pocketbase';
import styles from './sidebar.module.css';
import IconMenu from '@/icons/menu';

export default function Sidebar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const avatar = user ? pb.files.getURL(user, user.avatar) : null;

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
    <aside
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

            <span className={styles.userName}>{user.name}</span>
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
        <h3>Current clients</h3>
      </div>
    </aside>
  );
}
