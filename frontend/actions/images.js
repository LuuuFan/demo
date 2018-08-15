import * as APIUtilImg from '../util/img';

export const RECEIVE_IMG = 'RECEIVE_IMG';
export const RECEIVE_ALL_IMGS = 'RECEIVE_ALL_IMGS';

export const receiveAllImgs = (imgs) => ({
	type: RECEIVE_ALL_IMGS,
	imgs
});

export const receiveImg = (img) => ({
	type: RECEIVE_IMG,
	img
})

export const fetchAllImgs = (token) => dispatch => APIUtilImg.fetchAllImgs(token)
	.then(
		res => dispatch(receiveAllImgs(JSON.parse(res).images)) 	
	);

