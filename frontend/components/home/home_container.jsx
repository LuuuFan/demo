import React from 'react';
import { connect } from 'react-redux';
import Home from './home';
import {fetchAllImgs, receiveImg} from '../../actions/images';
import {receiveCanvas} from '../../actions/canvas';
import {sendEmail} from '../../actions/mail';


const mapStateToProps = (state)  => ({
	imgs: state.imgs,
	canvas: state.canvas,
	currentUser: state.session.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
	fetchAllImgs: token => dispatch(fetchAllImgs(token)),
	receiveCanvas: canvas => dispatch(receiveCanvas(canvas)),
	receiveImg: img => dispatch(receiveImg(img)),
	sendEmail: (token, formData) => dispatch(sendEmail(token, formData)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
