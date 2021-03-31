import React from 'react';
import { useAuth } from '../../contexts/auth';

const LoginButton = () => {
  const { signIn } = useAuth();
  return <button onClick={signIn}>Login</button>;
};

export default LoginButton;
