import * as APIUtilMail from '../util/mail';
import {receiveError} from './error';
import {receiveMessage} from './message';

export const sendEmail = (token, formData) => dispatch => APIUtilMail.sendEmail(token, formData)
	.then(
		message => dispatch(receiveMessage(message)),
		errors => dispatch(receiveError(errors.responseJSON))	
	)	.catch((err)=>{
		debugger
	});