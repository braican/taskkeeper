import React from 'react';
import PropTypes from 'prop-types';
import Button from 'components/ui/Button';
import { useAuth } from 'hooks';

const LoginButton = ({ className = '' }) => {
  const { signIn, authLoading } = useAuth();
  return (
    <Button className={className} onClick={signIn}>
      {authLoading ? 'Loading...' : 'Login with Google'}
    </Button>
  );
};

LoginButton.propTypes = {
  className: PropTypes.string,
};

export default LoginButton;
