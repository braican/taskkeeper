import React from 'react';
import PropTypes from 'prop-types';
import { Route, Redirect } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, condition, redirect, ...rest }) => (
  <Route
    {...rest}
    render={props => (condition ? <Component {...props} /> : <Redirect to={redirect} />)}
  />
);

ProtectedRoute.propTypes = {
  component: PropTypes.oneOfType([PropTypes.func, PropTypes.object]).isRequired,
  condition: PropTypes.bool.isRequired,
  redirect: PropTypes.string.isRequired,
};

export default ProtectedRoute;
