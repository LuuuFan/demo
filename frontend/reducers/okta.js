import {RECEIVE_OKTA_SIGNIN} from '../actions/okta';

const oktaReducer = (state={}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_OKTA_SIGNIN:
			return {okta: action.okta};
		default: 
			return state;
	}
};

export default oktaReducer;