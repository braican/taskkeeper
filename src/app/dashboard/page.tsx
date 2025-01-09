// app/dashboard/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome, {user?.name || 'friend'}!</p>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
}
