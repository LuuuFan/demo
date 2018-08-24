export const RECEIVE_CHANNEL = 'RECEIVE_CHANNEL';
export const REMOVE_CHANNEL = 'REMOVE-CHANNEL';
export const RECEIVE_CHAT_MESSAGE = 'RECEIVE_CHAT_MESSAGE';

export const receiveChannel = (channel) => ({
	type: RECEIVE_CHANNEL,
	channel
})

export const removeChannel = (channel) => ({
	type: REMOVE_CHANNEL,
	channel
})

export const receiveChatMessage = (channel, message, t) => ({
	type: RECEIVE_CHAT_MESSAGE,
	channel,
	message,
	t,
})