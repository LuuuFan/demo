import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/root';
import {logger} from 'redux-logger';


const middlewares = [thunk];

// if (process.env.NODE_ENV !== 'production') {
//   const { logger } = require('redux-logger');
// }

const configureStore = (preloadedState={}) => (
  createStore(
  	rootReducer,
    preloadedState,
    applyMiddleware(logger)
  )
);

export default configureStore;