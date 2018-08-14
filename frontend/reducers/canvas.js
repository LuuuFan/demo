import {RECEIVE_CANVAS} from '../actions/canvas';

const canvasReducer = (state={}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_CANVAS:
			return action.canvas;
		default:
			return state;	
	}
};

export default canvasReducer;