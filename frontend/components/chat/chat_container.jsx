import React from 'react';
import { connect } from 'react-redux';
import Chat from './chat';
import { receiveChannel, removeChannel, receiveChatMessage, selectChannel} from '../../actions/channel';
import { toggleChat } from '../../actions/chat';
import {getUserList} from '../../actions/user';

const mapStateToProps = (state) => ({
	channel: state.channel,
	currentUser: state.session.currentUser,
	active: state.chat.active,
	userList: state.user
})

const mapDispatchToProps = (dispatch) => ({
	receiveChannel: channel => dispatch(receiveChannel(channel)),
	removeChannel: channel => dispatch(removeChannel(channel)),
	receiveChatMessage: (channel, message, type) => dispatch(receiveChatMessage(channel, message, type)),
	// toggleChannel: (channel, active) => dispatch(toggleChannel(channel, active)),
	toggleChat: () => dispatch(toggleChat()),
	getUserList: (token)=> dispatch(getUserList(token)),
	selectChannel: (channel) => dispatch(selectChannel(channel)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat);