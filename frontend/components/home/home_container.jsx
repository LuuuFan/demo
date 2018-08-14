import React from 'react';
import { connect } from 'react-redux';
import Home from './home';
import {fetchAllImgs} from '../../actions/images';

const mapStateToProps = (state)  => ({
	imgs: state.imgs,
	currentUser: state.session.currentUser
});

const mapDispatchToProps = (dispatch) => ({
	fetchAllImgs: token => dispatch(fetchAllImgs(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
