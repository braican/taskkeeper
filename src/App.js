import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import SvgSprite from 'components/ui/SvgSprite';
import Header from 'components/elements/Header';
import Dashboard from 'views/Dashboard';
import Welcome from 'views/Welcome';
import Client from 'views/Client';
import { PDFViewer } from '@react-pdf/renderer';
import InvoicePdf from 'views/InvoicePdf';
import { useAuth } from './hooks';
import { ClientProvider, TaskProvider, InvoiceProvider, ProjectProvider } from './providers';

import './styles/app.scss';

const AuthRoutes = () => (
  <ClientProvider>
    <TaskProvider>
      <InvoiceProvider>
        <ProjectProvider>
          <SvgSprite />
          <Header />
          <Switch>
            <Route path="/dashboard" render={() => <Dashboard />} />
            <Route path="/client/:clientId" render={() => <Client />} />
            <Route
              path="/invoice"
              render={() => (
                <div style={{ flex: 1 }}>
                  <PDFViewer style={{ width: '100%', height: '100%' }}>
                    <InvoicePdf />
                  </PDFViewer>
                </div>
              )}
            />
            <Route path="/*" render={() => <Redirect to="/dashboard" />} />
          </Switch>
        </ProjectProvider>
      </InvoiceProvider>
    </TaskProvider>
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
