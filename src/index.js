import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReactGA from 'react-ga';
import { createFirestoreInstance } from 'redux-firestore';
import { ReactReduxFirebaseProvider } from 'react-redux-firebase';
import store from './store';
import firebase from './firebase';
import Taskkeeper from './Taskkeeper';

import './styles/globals.scss';

ReactGA.initialize('UA-20596099-21');

const rrfProps = {
  firebase,
  config: {
    userProfile: 'users',
    useFirestoreForProfile: true,
  },
  dispatch: store.dispatch,
  createFirestoreInstance,
};

const App = () => (
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps}>
      <Taskkeeper />
    </ReactReduxFirebaseProvider>
  </Provider>
);

ReactDOM.render(<App />, document.getElementById('root'));
