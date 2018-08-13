import * as APIUtilSession from '../util/session';

export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';


export const receiveCurrentUser = (currentUser) => ({
	type: RECEIVE_CURRENT_USER,
	currentUser
});

export const createUser = (user) => dispatch => APIUtilSession.registration(user)
	.then(
	// () => {
	// 	debugger
	// });
		user => dispatch(receiveCurrentUser(user))
		// errors => dispatch(receiveErrors())
	);

export const createSession = (user) => dispatch => APIUtilSession.login(user)
	.then(
		user => dispatch(receiveCurrentUser(user))
	);