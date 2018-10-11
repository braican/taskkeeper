import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import view from './view';

const rootReducer = combineReducers({ view, routing: routerReducer });

export default rootReducer;
