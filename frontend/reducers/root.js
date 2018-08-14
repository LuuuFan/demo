import { combineReducers } from 'redux';
import sessionReducer from './session';
import imgReducer from './img';
import errorReducer from './error'

const rootReducer = combineReducers({
  session: sessionReducer,
  imgs: imgReducer,
  error: errorReducer,
});

export default rootReducer;
