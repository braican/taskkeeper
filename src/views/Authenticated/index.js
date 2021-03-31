import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Header from '../../components/Header';
import Dashboard from '../Dashboard';
import { useAuth } from '../../contexts/auth';

const Authenticated = () => {
  const { isSignedIn } = useAuth();

  return (
    <div>
      <Header />

      <main>
        <Switch>
          <Route
            path="/dashboard"
            render={() => (isSignedIn ? <Dashboard /> : <Redirect to="/" />)}
          />
          <Route path="/" render={() => <Redirect to="/dashboard" />} />
        </Switch>
      </main>
    </div>
  );
};
export default Authenticated;
