//src/redux/reducers.js
import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import { views as viewsReducer, initialState as viewsInitial } from './views';
import { refs as refsReducer, initialState as refsInitial } from './refs';

export const initialState = {
  views: viewsInitial,
  refs: refsInitial,
};

export const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  views: viewsReducer,
  refs: refsReducer,
});

export default rootReducer;
