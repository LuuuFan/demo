import {RECEIVE_ERROR, CLEAR_ERROR} from '../actions/error';

const errorReducer = (state={}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_ERROR:
			return action.error;
		case CLEAR_ERROR:
			return {};
		default: 
			return state;
	}
};

export default errorReducer;