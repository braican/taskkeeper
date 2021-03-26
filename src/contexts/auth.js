import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useGoogleLogin } from 'react-google-login';
import { post } from '../util';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  const onSuccess = googleData => {
    post('auth', { token: googleData.tokenId })
      .then(userData => {
        setUserData(userData);
        setLoaded(true);
      })
      .catch(console.error);
  };

  const onFailure = error => {
    console.warn(`[LOGIN FAILURE]: error: ${error}`);
  };

  const { signIn } = useGoogleLogin({
    clientId: process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID,
    onSuccess,
    onFailure,
    onAutoLoadFinished: autoLoaded => {
      if (!autoLoaded) {
        setLoaded(true);
      }
    },
    isSignedIn: true,
    cookiePolicy: 'single_host_origin',
  });

  return (
    <AuthContext.Provider value={{ isSignedIn: userData ? true : false, loaded, signIn, userData }}>
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
 * userData   : object
 *   uid     : string
 *   name    : string
 *   email   : string
 *   picture : string
 *   secret  : string
 */
export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
