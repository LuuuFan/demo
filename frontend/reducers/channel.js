import {RECEIVE_CHANNEL, REMOVE_CHANNEL, RECEIVE_CHAT_MESSAGE, SELECT_CHANNEL} from '../actions/channel';

const channelReducer = (state = {selected: ''}, action) => {
	Object.freeze(state);
	let newState;
	switch(action.type){
		case REMOVE_CHANNEL:
			newState = Object.assign({}, state);
			// delete newState[action.channel.toLowerCase()];
			newState[action.channel].status = false;
			const activeChannels = Object.keys(newState).filter(el => newState[el].status && el !== 'selected');
			newState.selected = activeChannels[0] || "";
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
			newState.selected = action.channel.toLowerCase();
			localStorage.setItem('channel', JSON.stringify(newState));
			return newState;
		case RECEIVE_CHAT_MESSAGE:
			newState = Object.assign({}, state);
			const timestamp = new Date();
			if (!newState[action.channel.toLowerCase()]) {
				newState[action.channel.toLowerCase()] = {
																										message: {}, 
																										status: true, 
																										// active: true
																									};
			} else {
				newState[action.channel.toLowerCase()].status = true;
				// newState[action.channel.toLowerCase()].active = true;
			}
			newState[action.channel.toLowerCase()].message[timestamp.getTime()] = {
																																								type: action.t, 
																																								text: action.message,
																																								date: timestamp.toDateString(),
																																								time: timestamp.toLocaleTimeString().split(' ')[0].split(':').slice(0, 2).join(':') + ' ' + timestamp.toLocaleTimeString().split(' ')[1],
																																							};
			localStorage.setItem('channel', JSON.stringify(newState));
			return newState;
		// ** Not use for now **
		// case TOGGLE_CHANNEL:
		// 	newState = Object.assign({}, state);
		// 	if (newState[action.channel]) {
		// 		newState[action.channel].active = action.active;
		// 	}
		// 	localStorage.setItem('channel', JSON.stringify(newState));
		// 	return newState;
		case SELECT_CHANNEL:
			newState = Object.assign({}, state);
			newState.selected = action.channel;
			return newState;
		default: 
			return state;
	}
};

export default channelReducer;