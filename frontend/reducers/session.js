import {RECEIVE_CURRENT_USER, REMOVE_CURRENT_USER} from '../actions/session';


const _nullSession = {currentUser: null};

const sessionReducer = (state=_nullSession, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_CURRENT_USER:
			const message = action.currentUser.message.split(' ');
			const currentUser = {
				'access-token': action.currentUser['access-token'],
				username: message[message.length - 1],
			}
			localStorage.setItem('currentUser', JSON.stringify(currentUser));
			localStorage.setItem('access_token', JSON.stringify(currentUser['access-token']));
			newState = {currentUser: currentUser};
			return newState;
		case REMOVE_CURRENT_USER:
			return {};
		default:
			return state;
	}
};

export default sessionReducer;