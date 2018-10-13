import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';

import './sass/style.css';

// Import components
import App from './components/App/App';
import Sidebar from './components/Sidebar/Sidebar';
import Auth from './components/Auth/Auth';
import NewClientForm from './components/NewClientForm/NewClientForm';

import store from './store';

const router = (
    <Provider store={store}>
        <App>
            <Sidebar>
                <Auth />
            </Sidebar>

            <NewClientForm />
        </App>
    </Provider>
);

render(router, document.getElementById('root'));
