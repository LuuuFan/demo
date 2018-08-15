import React from 'react';
import { connect } from 'react-redux';
import Home from './home';
import {fetchAllImgs} from '../../actions/images';
import {receiveCanvas} from '../../actions/canvas';


const mapStateToProps = (state)  => ({
	imgs: state.imgs,
	canvas: state.canvas,
	currentUser: state.session.currentUser,
});

const mapDispatchToProps = (dispatch) => ({
	fetchAllImgs: token => dispatch(fetchAllImgs(token)),
	receiveCanvas: canvas => dispatch(receiveCanvas(canvas)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
