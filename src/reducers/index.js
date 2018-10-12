import { combineReducers } from 'redux';
// import { routerReducer } from 'react-router-redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

import view from './view';

const rootReducer = combineReducers({
    view,
    firebase: firebaseReducer,
    fireStore: firestoreReducer
});

export default rootReducer;
