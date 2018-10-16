import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';

import './sass/style.css';

// Import components
import App from './components/App/App';
import Sidebar from './components/Sidebar/Sidebar';
import Auth from './components/Auth/Auth';
import ClientList from './components/ClientList/ClientList';
import NewClientForm from './components/NewClientForm/NewClientForm';

import store from './store';

const router = (
    <Provider store={store}>
        <App>
            <BrowserRouter>
                <div>
                    <Sidebar>
                        <Auth />
                        <ClientList />
                    </Sidebar>

                    {/* <Route exact path="/" component={() => <h1>Home</h1>)} /> */}
                    {/* <Route path="" */}

                    <NewClientForm />
                </div>
            </BrowserRouter>
        </App>
    </Provider>
);

render(router, document.getElementById('root'));
