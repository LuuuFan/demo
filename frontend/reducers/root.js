import { combineReducers } from 'redux';
import sessionReducer from './session';
import imgReducer from './img';
import errorReducer from './error';
import canvasReducer from './canvas';


const rootReducer = combineReducers({
  session: sessionReducer,
  imgs: imgReducer,
  error: errorReducer,
  canvas: canvasReducer,
});

export default rootReducer;
