import {TOGGLE_CHAT} from '../actions/chat';

const chatReducer = (state={action: false}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case TOGGLE_CHAT:
			newState = Object.assign({}, state);
			newState.active = !newState.active;
			return newState;
		default:
			return state;  
	}
};

export default chatReducer;