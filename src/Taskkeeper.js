import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase';
import { CSSTransition } from 'react-transition-group';

import { BrowserRouter, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import ReactGA from 'react-ga';

import Welcome from './components/Welcome';
import Dashboard from './components/Dashboard';
import DashboardButton from './components/Dashboard/DashboardButton';
import SidebarTrigger from './components/SidebarTrigger';
import Auth from './components/Auth';
import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import ClientPane from './components/ClientPane';

const history = createBrowserHistory();

// Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

const mapStateToProps = state => ({
  auth: state.firebase.auth,
  sidebarVisible: state.views.sidebarVisible,
});

const mapDispatchToProps = dispatch => ({
  toggleSidebar: isOpen => dispatch({ type: 'TOGGLE_CLIENT_SIDEBAR', isOpen }),
});

const Taskkeeper = ({ auth, sidebarVisible, toggleSidebar }) => {
  if (!isLoaded(auth)) {
    return <div className="app-loading">Loading...</div>;
  }
  const main = useRef();

  const handleOffClick = () => {
    toggleSidebar(false);
  };

  useEffect(() => {
    if (!main || !main.current) {
      return;
    }

    main.current.addEventListener('mousedown', handleOffClick);

    return () => {
      main.current.removeEventListener('mousedown', handleOffClick);
    };
  }, []);

  return (
    <BrowserRouter history={history}>
      <>
        {!isEmpty(auth) && (
          <>
            <Auth />
            <SidebarTrigger />
            <div className={`layout${sidebarVisible ? ' layout--sidebar-visible' : ''}`}>
              <aside className="sidebar">
                <DashboardButton />
                <ClientForm />
                <ClientList />
              </aside>
              <div className="main" ref={main}>
                <div className="container">
                  <Route path="/" exact component={Dashboard} />
                  <Route path="/client/:clientId" component={ClientPane} />
                </div>
              </div>
            </div>
          </>
        )}

        <CSSTransition in={isEmpty(auth)} classNames="trs-fadein" timeout={400} unmountOnExit>
          <Welcome />
        </CSSTransition>
      </>
    </BrowserRouter>
  );
};

Taskkeeper.propTypes = {
  auth: PropTypes.object,
  sidebarVisible: PropTypes.bool,
  toggleSidebar: PropTypes.func,
};

export default compose(
  firebaseConnect(),
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
)(Taskkeeper);
