export const RECEIVE_CHANNEL = 'RECEIVE_CHANNEL';
export const REMOVE_CHANNEL = 'REMOVE-CHANNEL';
export const RECEIVE_CHAT_MESSAGE = 'RECEIVE_CHAT_MESSAGE';
// export const TOGGLE_CHANNEL = 'TOGGLE_CHANNEL';
export const SELECT_CHANNEL = 'SELECT_CHANNEL';

export const receiveChannel = (channel) => ({
	type: RECEIVE_CHANNEL,
	channel
});

export const removeChannel = (channel) => ({
	type: REMOVE_CHANNEL,
	channel
});

export const receiveChatMessage = (channel, message, t) => ({
	type: RECEIVE_CHAT_MESSAGE,
	channel,
	message,
	t,
});

// export const toggleChannel = (channel, active) => ({
// 	type: TOGGLE_CHANNEL,
// 	channel,
// 	active,
// })

export const selectChannel = (channel) => ({
	type: SELECT_CHANNEL,
	channel,
});