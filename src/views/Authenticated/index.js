import React from 'react';
import PropTypes from 'prop-types';
import { isEmpty } from 'react-redux-firebase';
import { Switch, withRouter } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import ProtectedRoute from '../../components/Utils/ProtectedRoute';
import Dashboard from '../../components/Dashboard';
import Client from '../../components/Client';
import Welcome from '../Welcome';

import transitionStyles from './Authenticated.module.scss';

const AuthenticatedView = ({ auth, location }) => {
  return (
    <div className="authenticated">
      <TransitionGroup className={transitionStyles.auth__wrap}>
        <CSSTransition key={location.key} timeout={300} classNames={{ ...transitionStyles }}>
          <Switch location={location}>
            <ProtectedRoute
              path="/"
              exact
              component={Welcome}
              condition={isEmpty(auth)}
              redirect="/dashboard"
            />
            <ProtectedRoute
              path="/dashboard"
              component={Dashboard}
              condition={!isEmpty(auth)}
              redirect="/"
            />
            <ProtectedRoute
              path="/client/:clientId"
              component={Client}
              condition={!isEmpty(auth)}
              redirect="/"
            />
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

AuthenticatedView.propTypes = {
  auth: PropTypes.object.isRequired,
  location: PropTypes.object,
};

export default withRouter(AuthenticatedView);
