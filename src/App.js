import React from 'react';
import AuthenticatedView from './views/Authenticated';
import AnonymousView from './views/Anonymous';
import { useAuth } from './contexts/auth';

import './styles/app.scss';

const AppLoaded = () => {
  const { isSignedIn, error } = useAuth();

  if (error) {
    return <p>{error}</p>;
  }

  if (isSignedIn) {
    return <AuthenticatedView />;
  }

  return <AnonymousView />;
};

const App = () => {
  const { loaded } = useAuth();

  return <div className="App">{loaded ? <AppLoaded /> : <p>Loading...</p>}</div>;
};

export default App;
