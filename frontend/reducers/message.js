import {RECEIVE_MESSAGE, CLEAR_MESSAGE} from '../actions/message';

const messageReducer = (state = {}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_MESSAGE:
			return action.message;
		case CLEAR_MESSAGE:
			return {};
		default:
			return state;
	}
};

export default messageReducer;