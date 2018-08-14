import {RECEIVE_ALL_IMGS} from '../actions/images';

const imgReducer = (state={}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_ALL_IMGS:
			return action.imgs;
		default:
			return state;
	}
};

export default imgReducer;