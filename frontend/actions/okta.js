import * as OktaUtil from '../util/okta_util';

export const RECEIVE_OKTA_SIGNIN = 'RECEIVE_OKTA_SIGNIN';

export const receiveOktaSignIn = (okta) => ({
	type: RECEIVE_OKTA_SIGNIN,
	okta,
});

