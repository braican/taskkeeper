import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';
import { useAuth } from '../../hooks';

const LoginButton = ({ className = '' }) => {
  const { signIn, authLoading } = useAuth();
  return (
    <Button
      className={className}
      onClick={signIn}
      text={authLoading ? 'Loading...' : 'Login with Google'}
    />
  );
};

LoginButton.propTypes = {
  className: PropTypes.string,
};

export default LoginButton;
