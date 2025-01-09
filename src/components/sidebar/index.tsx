'use client';

import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import UserNav from '@/components/user-nav';
import pb from '@/lib/pocketbase';
import styles from './sidebar.module.css';

export default function Sidebar() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
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

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className="sr-only">Taskkeeper</h1>
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

            <span>{user.name}</span>
          </>
        )}

        {userMenuOpen && (
          <div ref={menuRef}>
            <UserNav />
          </div>
        )}
      </header>

      <div className={styles.sidebarNav}></div>
    </aside>
  );
}
