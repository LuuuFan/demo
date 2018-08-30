import {RECEIVE_CHANNEL, REMOVE_CHANNEL, RECEIVE_CHAT_MESSAGE, TOGGLE_CHANNEL} from '../actions/channel';

const channelReducer = (state = {}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case REMOVE_CHANNEL:
			newState = Object.assign({}, state);
			// delete newState[action.channel.toLowerCase()];
			newState[action.channel.toLowerCase()].status = false;
			localStorage.setItem('channel', JSON.stringify(newState));
			return newState;
		case RECEIVE_CHANNEL:
			newState = Object.assign({}, state)
			if (newState[action.channel.toLowerCase()]) {
				newState[action.channel.toLowerCase()].status = true;
				newState[action.channel.toLowerCase()].active = true;
			} else {
				newState[action.channel.toLowerCase()] = {message: {}, status: true, active: true};
			}
			localStorage.setItem('channel', JSON.stringify(newState));
			return newState;
		case RECEIVE_CHAT_MESSAGE:
			newState = Object.assign({}, state);
			const timestamp = new Date().getTime();
			if (!newState[action.channel.toLowerCase()]) {
				newState[action.channel.toLowerCase()] = {message: {}, status: true, active: true};
			} else {
				newState[action.channel.toLowerCase()].status = true;
				newState[action.channel.toLowerCase()].active = true;
			}
			newState[action.channel.toLowerCase()].message[timestamp] = {type: action.t, text: action.message};
			localStorage.setItem('channel', JSON.stringify(newState));
			return newState;
		case TOGGLE_CHANNEL:
			newState = Object.assign({}, state);
			if (newState[action.channel]) {
				newState[action.channel].active = action.active;
			}
			localStorage.setItem('channel', JSON.stringify(newState));
			return newState;
		default: 
			return state;
	}
};

export default channelReducer;