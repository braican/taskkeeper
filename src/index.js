import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import './sass/style.css';

// Import components
import App from './components/App';
import Sidebar from './components/Sidebar';
import Auth from './components/Auth';
import ClientList from './components/ClientList';
import Overview from './components/Overview';
import ClientPane from './components/ClientPane';
import NewClientForm from './components/NewClientForm';

import store from './store';

const router = (
    <Provider store={store}>
        <App>
            <BrowserRouter>
                <div className="app">
                    <Sidebar>
                        <Auth />
                        <ClientList />
                    </Sidebar>

                    <main className="appmain">
                        <Switch className="appmain">
                            <Route exact path="/" component={() => <Overview />} />
                            <Route
                                path="/client/:clientId"
                                component={request => (
                                    <ClientPane clientId={request.match.params.clientId} />
                                )}
                            />
                        </Switch>
                    </main>

                    <NewClientForm />
                </div>
            </BrowserRouter>
        </App>
    </Provider>
);

render(router, document.getElementById('root'));
