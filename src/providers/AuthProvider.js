import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useGoogleLogin, useGoogleLogout } from 'react-google-login';
import { AuthContext } from '../contexts';
import { post } from '../util';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleLoginSuccess = googleData => {
    setAuthLoading(true);
    post('auth', { token: googleData.tokenId })
      .then(userData => {
        setUserData(userData);
        setLoaded(true);
        setAuthLoading(false);
      })
      .catch(console.error);
  };

  const handleLogoutSuccess = () => {
    setUserData(null);
    post('logout', { secret: userData.secret });
  };

  const onFailure = error => {
    if (error.error === 'idpiframe_initialization_failed') {
      setError(
        'Unable to authenticate in browsers that have third-party cookies disabled, like a private browser.',
      );
      console.warn('[UNABLE TO AUTHENTICATE IN A PRIVATE BROWSER]');
    } else {
      console.warn('[LOGIN FAILURE]', error);
    }
  };

  const { signIn } = useGoogleLogin({
    clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
    onSuccess: handleLoginSuccess,
    onFailure,
    onAutoLoadFinished: autoLoaded => {
      if (!autoLoaded) {
        setLoaded(true);
      }
    },
    isSignedIn: true,
    cookiePolicy: 'single_host_origin',
  });

  const { signOut } = useGoogleLogout({
    clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
    onLogoutSuccess: handleLogoutSuccess,
  });

  return (
    <AuthContext.Provider
      value={{
        signIn,
        signOut,
        loaded,
        authLoading,
        error,
        isSignedIn: userData ? true : false,
        userData,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
