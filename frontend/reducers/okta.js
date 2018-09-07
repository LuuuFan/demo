import {RECEIVE_OKTA_SIGNIN, RECEIVE_OKTA_TOKEN, RECEIVE_OKTA_SESSION, REMOVE_OKTA_SESSION} from '../actions/okta';

const oktaReducer = (state={}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_OKTA_SIGNIN:
			newState = Object.assign({}, state);
			newState['okta'] = action.okta;
			return newState;
		case RECEIVE_OKTA_TOKEN:
			newState = Object.assign({}, state);
			newState['accessToken'] = action.accessToken,
			newState['idToken'] = action.idToken;
			localStorage.setItem('oktaAccessToken', JSON.stringify(action.accessToken));
			localStorage.setItem('oktaIdToken', JSON.stringify(action.idToken));
			return newState;
		case RECEIVE_OKTA_SESSION:
			newState = Object.assign({}, state);
			newState['session'] = action.session;
			localStorage.setItem('oktaSession', JSON.stringify(action.session));
			return newState;
		case REMOVE_OKTA_SESSION:
			newState = Object.assign({}, state);
			delete newState['accessToken'];
			delete newState['session'];
			delete newState['idToken'];
			localStorage.removeItem('oktaAccessToken');
			localStorage.removeItem('oktaIdToken');
			localStorage.removeItem('oktaSession');
			return newState;
		default: 
			return state;
	}
};

export default oktaReducer;