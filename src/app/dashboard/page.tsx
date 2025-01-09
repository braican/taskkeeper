// app/dashboard/page.tsx
'use client';

import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Dashboard() {
  const { isAuthenticated, user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/'); // Redirect to the home page if not authenticated
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <p>Loading...</p>; // Show loading until redirected
  }

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.email || 'User'}!</p>
      <button
        onClick={() => {
          logout();
          router.push('/'); // Redirect to the home page after logging out
        }}
      >
        Log Out
      </button>
    </div>
  );
}
