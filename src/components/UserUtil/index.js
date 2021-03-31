import React from 'react';
import { useAuth } from '../../contexts/auth';

const UserUtil = () => {
  const { userData, signOut } = useAuth();

  return (
    <div>
      <img src={userData.picture} alt={`Avatar for user ${userData.name}`} />
      <button onClick={signOut}>Log out</button>
    </div>
  );
};

export default UserUtil;
