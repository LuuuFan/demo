import React from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import Home from './home';
import {fetchAllImgs, receiveImg, receiveSelectedImg} from '../../actions/images';
import {removeCurrentUser} from '../../actions/session';
import {receiveCanvas} from '../../actions/canvas';
import {sendEmail} from '../../actions/mail';
import {clearMessage} from '../../actions/message';
import {sendService} from '../../actions/service';

const mapStateToProps = (state)  => ({
	imgs: state.imgs,
	canvas: state.canvas,
	currentUser: state.session.currentUser,
	message: state.message,
	selectedImg: state.selectedImg,
});

const mapDispatchToProps = (dispatch) => ({
	fetchAllImgs: token => dispatch(fetchAllImgs(token)),
	receiveCanvas: canvas => dispatch(receiveCanvas(canvas)),
	receiveImg: img => dispatch(receiveImg(img)),
	sendEmail: (token, formData) => dispatch(sendEmail(token, formData)),
	clearMessage: () => dispatch(clearMessage()),
	sendService: (data, token) => dispatch(sendService(data, token)),
	receiveSelectedImg: (img) => dispatch(receiveSelectedImg(img)),
	removeCurrentUser: () => dispatch(removeCurrentUser()),
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Home));
