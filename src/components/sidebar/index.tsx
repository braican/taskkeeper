'use client';

import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import IconLogo from '@/icons/logo';
import styles from './sidebar.module.css';
import pb from '@/lib/pocketbase';

export default function Sidebar() {
  const { user } = useAuth();
  const avatar = user ? pb.files.getURL(user, user.avatar) : null;

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <span className={styles.logo}>
          <IconLogo />
        </span>
        <h1 className="sr-only">Taskkeeper</h1>

        {user ? (
          <figure className={styles.figure}>
            {avatar ? (
              <Image fill={true} src={avatar} alt="" />
            ) : (
              <span className={styles.avatarPlaceholder}>
                {user.name.charAt(0)}
              </span>
            )}
          </figure>
        ) : null}
      </header>
    </aside>
  );
}
