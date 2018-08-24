import { combineReducers } from 'redux';
import sessionReducer from './session';
import imgReducer from './img';
import errorReducer from './error';
import canvasReducer from './canvas';
import messageReducer from './message';
import channelReducer from './channel';

const rootReducer = combineReducers({
  session: sessionReducer,
  imgs: imgReducer,
  error: errorReducer,
  canvas: canvasReducer,
  message: messageReducer,
  channel: channelReducer,
});

export default rootReducer;
