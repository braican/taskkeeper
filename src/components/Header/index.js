import React from 'react';
import UserUtil from '../UserUtil';
import { useAuth } from '../../contexts/auth';

const Header = () => {
  const { isSignedIn } = useAuth();

  return (
    <header>
      {isSignedIn && <UserUtil />}

      <h2>Taskkeeper</h2>
    </header>
  );
};

export default Header;
