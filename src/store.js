import { createStore, compose } from 'redux';
// import { syncHistoryWithStore } from 'react-router-redux';
// import { browserHistory } from 'react-router';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore } from 'redux-firestore';
import firebase from './firebase';

// import the route reducer
import rootReducer from './reducers/index';

// react-redux-firebase config
// const rrfConfig = {
//     userProfile: 'users',
//     useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
// };

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
    // reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
    reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

// create an object for default data
const defaultState = {
    view: {
        new_client_drawer: false
    }
};

const enhancers = compose(window.devToolsExtension ? window.devToolsExtension() : f => f);

const store = createStoreWithFirebase(rootReducer, defaultState, enhancers);

// export const history = syncHistoryWithStore(browserHistory, store);

if (module.hot) {
    module.hot.accept('./reducers/', () => {
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer);
    });
}

export default store;
