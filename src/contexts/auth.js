import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useGoogleLogin, useGoogleLogout } from 'react-google-login';
import { post } from '../util';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const handleLoginSuccess = googleData => {
    post('auth', { token: googleData.tokenId })
      .then(userData => {
        setUserData(userData);
        setLoaded(true);
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
      value={{ isSignedIn: userData ? true : false, loaded, signIn, signOut, userData, error }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node,
};

/**
 * @returns object
 *
 * isSignedIn : boolean
 * loaded     : boolean
 * signIn     : function
 * signOut    : function
 * userData   : object
 *   uid     : string
 *   name    : string
 *   email   : string
 *   picture : string
 *   secret  : string
 * error      : false|string
 */
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
