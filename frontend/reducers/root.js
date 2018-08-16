import { combineReducers } from 'redux';
import sessionReducer from './session';
import imgReducer from './img';
import errorReducer from './error';
import canvasReducer from './canvas';
import messageReducer from './message';

const rootReducer = combineReducers({
  session: sessionReducer,
  imgs: imgReducer,
  error: errorReducer,
  canvas: canvasReducer,
  message: messageReducer,
});

export default rootReducer;
