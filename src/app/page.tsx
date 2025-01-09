// app/page.tsx
'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    await login();
    router.push('/dashboard');
  };

  return (
    <div>
      <h1>Taskkeeper</h1>
      <button onClick={handleLogin}>Log In with Google</button>
    </div>
  );
}
