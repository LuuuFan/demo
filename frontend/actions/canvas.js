export const RECEIVE_CANVAS = 'RECEIVE_CANVAS';
export const REMOVE_CANVAS = 'REMOVE_CANVAS';

export const receiveCanvas = (id, canvas) => ({
	type: RECEIVE_CANVAS,
	id,
	canvas,
});

export const removeCanvas = (id) => ({
	type: REMOVE_CANVAS,
	id,
});