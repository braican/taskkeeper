import React from 'react';
import { useAuth } from '../../contexts/auth';

const Header = () => {
  const { isSignedIn, userData } = useAuth();

  return (
    <header>
      {isSignedIn && <p>Welcome {userData.name}</p>}
      <h2>Taskkeeper</h2>
    </header>
  );
};

export default Header;
