import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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

  return (
    <Switch>
      <Route path="/" exact render={() => <AnonymousView />} />
      <Route path="/*" render={() => <Redirect to="/" />} />
    </Switch>
  );
};

const App = () => {
  const { loaded } = useAuth();

  return (
    <div className="App">
      <Router>{loaded ? <AppLoaded /> : <p>Loading...</p>}</Router>
    </div>
  );
};

export default App;
