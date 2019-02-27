import { createStore } from 'redux';
import rootReducer from './reducers';

const defaultState = {
  clients: [],
};

const store = createStore(rootReducer, defaultState);

export default store;
