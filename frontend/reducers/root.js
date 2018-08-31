import { combineReducers } from 'redux';
import sessionReducer from './session';
import imgReducer from './img';
import errorReducer from './error';
import canvasReducer from './canvas';
import messageReducer from './message';
import channelReducer from './channel';
import selectedImgReducer from './selected_img';
import chatReducer from './chat';
import userReducer from './user';

const rootReducer = combineReducers({
  session: sessionReducer,
  user: userReducer,
  imgs: imgReducer,
  error: errorReducer,
  canvas: canvasReducer,
  message: messageReducer,
  channel: channelReducer,
  selectedImg: selectedImgReducer,
  chat: chatReducer,
});

export default rootReducer;
