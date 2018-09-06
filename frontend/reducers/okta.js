import {RECEIVE_OKTA_SIGNIN, RECEIVE_OKTA_TOKEN} from '../actions/okta';

const oktaReducer = (state={}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_OKTA_SIGNIN:
			newState = Object.assign({}, state);
			newState['okta'] = action.okta;
			return newState;
		case RECEIVE_OKTA_TOKEN:
			newState = Object.assgin({}, state);
			newState['accessToken'] = action.accessToken,
			newState['idToken'] = action.idToken;
			return newState;
		default: 
			return state;
	}
};

export default oktaReducer;