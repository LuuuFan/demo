import {RECEIVE_ALL_USER} from '../actions/user';

const userReducer = (state={}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_ALL_USER:
			return action.users;
		default:
			return state;
	}
};

export default userReducer;