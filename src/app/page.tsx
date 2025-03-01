// app/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/button';
import IconLogo from '@/icons/logo';

import styles from './page.module.css';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async () => {
    await login();
  };

  return (
    <div className={styles.layout}>
      <h1 className="page-title">
        <span className={styles.logo}>
          <IconLogo />
        </span>{' '}
        Taskkeeper
      </h1>
      <p className="mb-xl fs-2">Know what you&apos;re owe.</p>
      <Button onClick={handleLogin}>Log in with Google</Button>
      <p className={styles.copyright}>
        Built by{' '}
        <a href="https://braican.com" target="_blank">
          Nick Braica
        </a>
      </p>
    </div>
  );
}
