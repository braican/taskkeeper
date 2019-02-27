import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import ClientForm from './components/ClientForm';
import ClientList from './components/ClientList';
import ClientPane from './components/ClientPane';

import './styles/globals.scss';

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
