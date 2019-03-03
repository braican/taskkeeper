//src/redux/reducers.js
import { combineReducers } from 'redux';
import { firebaseReducer } from 'react-redux-firebase';
import { firestoreReducer } from 'redux-firestore';

export const initialState = {};

export const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
});

// const rootReducer = (state = [], action) => {
//   switch (action.type) {
//     case 'ADD_CLIENT':
//       return { ...state, clients: state.clients.concat(action.payload) };
//     default:
//       return state;
//   }
// };

export default rootReducer;
