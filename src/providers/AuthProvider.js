import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useGoogleLogin } from '@react-oauth/google';
import { AuthContext } from 'hooks';
import { post } from 'util/index';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleValidUser = userData => {
    setUserData(userData);
    setLoaded(true);
    setAuthLoading(false);

    localStorage.setItem('_tktoken', userData.token);
  };

  const handleError = error => {
    console.error(error);
    setError(error);
  };

  const handleNewLogin = code => {
    if (!code) {
      return;
    }

    setAuthLoading(true);

    post('auth', { code }).then(handleValidUser).catch(handleError);
  };

  const signIn = useGoogleLogin({
    onSuccess: ({ code }) => handleNewLogin(code),
    flow: 'auth-code',
  });

  const signOut = () => {
    setUserData(null);
    post('logout', { secret: userData.secret });
    localStorage.removeItem('_tktoken');
  };

  /**
   * Helper to send authorized requests with the secret.
   *
   * @param {string} route Endpoint to hit.
   * @param {object} data Dat to send with the request.
   *
   * @returns object|booleana
   */
  const authorizedPost = async (route, data = {}) => {
    if (!userData?.secret) {
      console.error(`Can't connect to the database.`);
      return false;
    }

    return await post(route, { ...data, secret: userData.secret });
  };

  useEffect(() => {
    const token = localStorage.getItem('_tktoken');

    if (!token) {
      setLoaded(true);
    } else {
      post('auth', { token }).then(handleValidUser).catch(handleError);
    }
  }, []);

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
        post: authorizedPost,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export default AuthProvider;
