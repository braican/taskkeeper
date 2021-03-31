import React from 'react';
import AuthenticatedView from './views/Authenticated';
import AnonymousView from './views/Anonymous';
import Header from './components/Header';
import { useAuth } from './contexts/auth';

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

  return (
    <div className="App">
      <Header />

      {loaded ? <AppLoaded /> : <p>Loading...</p>}
    </div>
  );
};

export default App;
