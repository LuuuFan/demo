export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

export const receiveMessage = (message) => ({
	type: RECEIVE_MESSAGE,
	message
}); 


export const clearMessage = () => ({
	type: CLEAR_MESSAGE,
})
