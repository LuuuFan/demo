export const RECEIVE_CHANNEL = 'RECEIVE_CHANNEL';
export const REMOVE_CHANNEL = 'REMOVE-CHANNEL';

export const receiveChannel = (channel) => ({
	type: RECEIVE_CHANNEL,
	channel
})

export const removeChannel = (channel) => ({
	type: REMOVE_CHANNEL,
	channel
})