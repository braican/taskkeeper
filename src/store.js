import { createStore, compose } from 'redux';
import { reactReduxFirebase } from 'react-redux-firebase';
import { reduxFirestore } from 'redux-firestore';
import firebase from './firebase';

// import the route reducer
import rootReducer from './reducers/index';

const enhancers = [
    reduxFirestore(firebase),
    reactReduxFirebase(firebase, {
        userProfile: 'users',
        useFirestoreForProfile: true
    })
];

if (window.devToolsExtension) {
    enhancers.push(window.devToolsExtension());
}

// create an object for default data
const defaultState = {
    view: {
        new_client_drawer: false,
        authenticated_user: false
    }
};

if (module.hot) {
    module.hot.accept('./reducers/', () => {
        const nextRootReducer = require('./reducers/index').default;
        store.replaceReducer(nextRootReducer);
    });
}

const composedEnhancers = compose(...enhancers);
const store = createStore(rootReducer, defaultState, composedEnhancers);
export default store;
