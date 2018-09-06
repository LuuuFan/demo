import * as OktaUtil from '../util/okta_util';

export const RECEIVE_OKTA_SIGNIN = 'RECEIVE_OKTA_SIGNIN';
export const RECEIVE_OKTA_TOKEN = 'RECEIVE_OKTA_TOKEN';
export const RECEIVE_OKTA_SESSION = 'RECEIVE_OKTA_SESSION';

export const receiveOktaSignIn = (okta) => ({
	type: RECEIVE_OKTA_SIGNIN,
	okta,
});

export const receiveOktaToken = (accessToken, idToken) => ({
	type: RECEIVE_OKTA_TOKEN,
	accessToken,
	idToken,
});

export const receiveOktaSession = (session) => ({
	type: RECEIVE_OKTA_SESSION,
	session,
})

// cannot use this
export const initialOkta = () => dispatch => OktaUtil.initialOkta()
	.then( res => {
		debugger
	}).catch(err => {
		debugger
	})