import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import SvgSprite from 'components/ui/SvgSprite';
import Header from 'components/elements/Header';
import Dashboard from 'views/Dashboard';
import Welcome from 'views/Welcome';
import Client from 'views/Client';
import { useAuth } from './hooks';
import { ClientProvider } from './providers';

import './styles/app.scss';

const AuthRoutes = () => (
  <ClientProvider>
    <SvgSprite />
    <Header />
    <main>
      <Switch>
        <Route path="/dashboard" render={() => <Dashboard />} />
        <Route path="/client/:id" render={() => <Client />} />
        <Route path="/*" render={() => <Redirect to="/dashboard" />} />
      </Switch>
    </main>
  </ClientProvider>
);

const AnonRoutes = () => (
  <Switch>
    <Route path="/" exact render={() => <Welcome />} />
    <Route path="/*" render={() => <Redirect to="/" />} />
  </Switch>
);

const App = () => {
  const { loaded, isSignedIn, error } = useAuth();

  if (!loaded) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <Router>{isSignedIn ? <AuthRoutes /> : <AnonRoutes />}</Router>
    </div>
  );
};

export default App;
