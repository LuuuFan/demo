import * as APIUtilSession from '../util/session';
import {receiveError} from './error';
export const RECEIVE_CURRENT_USER = 'RECEIVE_CURRENT_USER';


export const receiveCurrentUser = (currentUser) => ({
	type: RECEIVE_CURRENT_USER,
	currentUser
});

export const createUser = (user) => dispatch => APIUtilSession.registration(user)
	.then(
		user => dispatch(receiveCurrentUser(user)),
		errors => dispatch(receiveError(errors.responseJSON))
	);

export const createSession = (user) => dispatch => APIUtilSession.login(user)
	.then(
		user => dispatch(receiveCurrentUser(user)),
		errors => dispatch(receiveError(errors.responseJSON))
	).catch((error)=>{
		debugger
	});
