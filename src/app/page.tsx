// app/page.tsx
'use client';

import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login();
  };

  return (
    <div>
      <h1>Taskkeeper</h1>
      <button onClick={handleLogin}>Log In with Google</button>
    </div>
  );
}
