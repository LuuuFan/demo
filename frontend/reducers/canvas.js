import {RECEIVE_CANVAS, REMOVE_CANVAS} from '../actions/canvas';

const canvasReducer = (state={}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case RECEIVE_CANVAS:
			newState = Object.assign({}, state);
			newState[action.id] = action.canvas;
			return newState;
		case REMOVE_CANVAS:
			newState = Object.assign({}, state);
			delete newState[action.id];
			return newState;
		default:
			return state;	
	}
};

export default canvasReducer;