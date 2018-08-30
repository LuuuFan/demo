import {TOGGLE_CHAT} from '../actions/chat';

const chatReducer = (state={action: true}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case TOGGLE_CHAT:
			newState = Object.assign({}, state);
			newState.action = !newState.action;
			return newState;
		default:
			return state;  
	}
};

export default chatReducer;