import * as serviceUtil from '../util/service';
import {receiveMessage} from './message';
import {receiveError} from './error';

export const sendService = (requestData) => dispatch => serviceUtil.sendService(requestData)
	.then(
	data => dispatch(receiveMessage(JSON.parse(data).records[0].number)),
	error => dispatch(receiveError(JSON.parse(error))),
	);