import * as serviceUtil from '../util/service';
import {receiveMessage} from './message';
import {receiveError} from './error';

export const sendService = (data, token) => dispatch => serviceUtil.sendService(data, token)
	.then(
	// data => dispatch(receiveMessage(JSON.parse(data).records[0].number)),
	data => dispatch(receiveMessage(data)),
	error => dispatch(receiveError(JSON.parse(error))),
	);