import { createStore, combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import { userRefReducer, initialState as userRef } from './reducers/userRef';
import { invoiceReducer, initialState as invoice } from './reducers/invoices';

const initialState = {
  userRef,
  invoice,
};

const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  userRef: userRefReducer,
  invoice: invoiceReducer,
});

const store = createStore(
  rootReducer,
  initialState,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);

export default store;
