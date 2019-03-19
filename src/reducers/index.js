//src/redux/reducers.js
import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import { views as viewsReducer, initialState as viewsInitial } from './views';

export const initialState = {
  views: viewsInitial,
};

export const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  views: viewsReducer,
});

export default rootReducer;
