import {connect} from 'react-redux';
import {removeOktaSession} from '../../actions/okta';
import { withAuth } from '@okta/okta-react';
import Okta from './okta';

const mapStateToProps = (state) => ({
	okta: state.okta.okta,
	accessToken: state.okta.accessToken,
	idToken: state.okta.idToken,
	session: state.okta.session,
});

const mapDispatchToProps = dispatch => ({
	removeOktaSession: () => dispatch(removeOktaSession()),
});

export default withAuth(connect(mapStateToProps, mapDispatchToProps)(Okta));