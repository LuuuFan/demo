import * as APIUtilUser from '../util/user';
import {receiveError} from './error';

export const RECEIVE_ALL_USER = 'RECEIVE_ALL_USER';

export const receiveAllUser = (users) => ({
	type: RECEIVE_ALL_USER,
	users
});

export const getUserList = (token) => dispatch => APIUtilUser.getUserList(token)
	.then(
		users => dispatch(receiveAllUser(users)),
		errors => dispatch(receiveError(errors.responseJSON))
		)