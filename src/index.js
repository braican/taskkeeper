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

                    <Switch className="appmain">
                        <Route exact path="/" component={() => <h1>Home</h1>} />
                        <Route path="/client/:clientId" component={() => <h1>Clienbt</h1>} />
                    </Switch>

                    <NewClientForm />
                </div>
            </BrowserRouter>
        </App>
    </Provider>
);

render(router, document.getElementById('root'));
