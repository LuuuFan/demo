import {RECEIVE_SELECTED_IMG} from '../actions/images';


const selectedImgReducer = (state={}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_SELECTED_IMG:
			return action.img;
		default:
			return state;
	}
};

export default selectedImgReducer;
