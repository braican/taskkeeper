import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';

import { BrowserRouter, Route } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import SidebarTrigger from './components/SidebarTrigger';
import Auth from './components/Auth';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import ClientPane from './components/ClientPane';

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  sidebarVisible: state.views.sidebarVisible,
});

const Taskkeeper = ({ auth, sidebarVisible }) => {
  if (!isLoaded(auth)) {
    return <div>Loading</div>;
  }

  return (
    <BrowserRouter>
      <>
        <Auth />
        <SidebarTrigger />

        {!isEmpty(auth) ? (
          <div className={`layout${sidebarVisible ? ' layout--sidebar-visible' : ''}`}>
            <aside className="sidebar">
              <ClientForm />
              <ClientList />
            </aside>
            <div className="main">
              <Route path="/" exact component={Dashboard} />
              <Route path="/client/:clientId" component={ClientPane} />
            </div>
          </div>
        ) : (
          <div>Log in</div>
        )}
      </>
    </BrowserRouter>
  );
};

Taskkeeper.propTypes = {
  auth: PropTypes.object,
  sidebarVisible: PropTypes.bool,
};

export default compose(
  firebaseConnect(),
  connect(mapStateToProps),
)(Taskkeeper);
