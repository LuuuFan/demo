import React from 'react';
import { connect } from 'react-redux';
import {withRouter} from 'react-router';
import Share from './share';
import {removeCurrentUser} from '../../actions/session';

const mapDispatchToProps = dispatch => ({
	removeCurrentUser: () => dispatch(removeCurrentUser()),
})

export default withRouter(connect(null, mapDispatchToProps)(Share));