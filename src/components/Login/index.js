import React from 'react';
import GoogleLogin from 'react-google-login';
import { post } from '../../util';

const Login = () => {
  const onSuccess = googleData => {
    post('auth', { token: googleData.tokenId })
      .then(userData => {
        /* eslint-disable-next-line */
        console.log(userData);
      })
      .catch(error => {
        console.error(error);
      });
  };

  const onFail = error => {
    console.warn(`[LOGIN FAILURE]: error: ${error}`);
  };

  return (
    <div>
      <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID}
        buttonText="Log in with Google"
        onSuccess={onSuccess}
        onFailure={onFail}
        cookiePolicy={'single_host_origin'}
      />
    </div>
  );
};

export default Login;
