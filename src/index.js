import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import store from './store';
import { addClient } from './actions';

import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import ClientPane from './components/ClientPane';

import './styles/globals.scss';

window.store = store;
window.addClient = addClient;

const App = () => (
  <div>
    <ClientForm />
    <ClientList />
    <ClientPane />
  </div>
);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
