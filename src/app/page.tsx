// app/page.tsx
'use client';

import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/button';

export default function Home() {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  return (
    <div>
      <h1 className="page-title">Taskkeeper</h1>
      <Button onClick={handleLogin}>Log in with Google</Button>
    </div>
  );
}
