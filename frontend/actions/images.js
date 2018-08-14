import * AS APIUtilImg from '../util/img';


export const RECEIVE_ALL_IMGS = 'RECEIVE_ALL_IMGS';

export const receiveAllImgs = (imgs) => ({
	type: RECEIVE_ALL_IMGS,
	imgs
})

export const fetchAllImgs = (token) => dispatch => APIUtilImg.fetchAllImgs(token)
	.then(
		images => dispatch(receiveAllImgs(imgs)) 	
	);

