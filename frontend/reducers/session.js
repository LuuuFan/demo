import {RECEIVE_CURRENT_USER, REMOVE_CURRENT_USER} from '../actions/session';


const _nullSession = {currentUser: null};

const sessionReducer = (state=_nullSession, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_CURRENT_USER:
			newState = {currentUser: action.currentUser};
			return newState;
		case REMOVE_CURRENT_USER:
			return {};
		default:
			return state;
	}
};

export default sessionReducer;