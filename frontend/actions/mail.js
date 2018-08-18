import * as APIUtilMail from '../util/mail';
import {receiveError} from './error';

export const sendEmail = (token, formData) => dispatch => APIUtilMail.sendEmail(token, formData)
	.then((res)=>{
		debugger	
	}
	// 	res => dispatch(receiveError(JSON.parse(res)))
	// }
	).catch((err)=>{
		debugger
		
	});