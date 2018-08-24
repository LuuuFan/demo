import {RECEIVE_CHANNEL, REMOVE_CHANNEL} from '../actions/channel';

const channelReducer = (state = [], action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case REMOVE_CHANNEL:
			newState = Object.assign({}, state);
			delete newState[action.channel];
			return newState;
		case RECEIVE_CHANNEL:
			newState = Object.assign({}, state)
			newState[action.channel] = {};
			return newState;
		default: 
			return state;
	}
};

export default channelReducer;