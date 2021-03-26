import React from 'react';
import { useAuth } from '../../contexts/auth';

const Login = () => {
  const auth = useAuth();

  return (
    <div>
      <button onClick={auth.signIn}>Login</button>
    </div>
  );
};

export default Login;
