import React from 'react';
import { connect } from 'react-redux';
import Home from './home';
import {fetchAllImgs, receiveImg} from '../../actions/images';
import {receiveCanvas} from '../../actions/canvas';
import {sendEmail} from '../../actions/mail';
import {clearMessage} from '../../actions/message';
import {sendService} from '../../actions/service';

const mapStateToProps = (state)  => ({
	imgs: state.imgs,
	canvas: state.canvas,
	currentUser: state.session.currentUser,
	message: state.message,
});

const mapDispatchToProps = (dispatch) => ({
	fetchAllImgs: token => dispatch(fetchAllImgs(token)),
	receiveCanvas: canvas => dispatch(receiveCanvas(canvas)),
	receiveImg: img => dispatch(receiveImg(img)),
	sendEmail: (token, formData) => dispatch(sendEmail(token, formData)),
	clearMessage: () => dispatch(clearMessage()),
	sendService: (data) => dispatch(sendService(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
