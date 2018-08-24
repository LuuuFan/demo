import React from 'react';
import { connect } from 'react-redux';
import Chat from './chat';
import { receiveChannel, removeChannel } from '../../actions/channel';

const mapStateToProps = (state) => ({
	channel: state.channel,
	currentUser: state.session.currentUser,
})

const mapDispatchToProps = (dispatch) => ({
	receiveChannel: channel => dispatch(receiveChannel(channel)),
	removeChannel: channel => dispatch(removeChannel(channel)),
})

export default connect(mapStateToProps, mapDispatchToProps)(Chat);