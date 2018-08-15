import {RECEIVE_ALL_IMGS, RECEIVE_IMG} from '../actions/images';

const imgReducer = (state=[], action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_ALL_IMGS:
			return action.imgs;
		case RECEIVE_IMG:
			newState = Array.from(state);
			newState.push(action.img);
			return newState;
		default:
			return state;
	}
};

export default imgReducer;