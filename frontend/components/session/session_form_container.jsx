import {connect} from 'react-redux';
import {createUser, createSession} from '../../actions/session';
import SessionForm from './session_form';
import {clearError} from '../../actions/error';
import { withAuth } from '@okta/okta-react';


const mapStateToProps = (state, ownProps) => {
  let formType = ownProps.match.path === '/signup' ? 'signup' : 'login';
  return ({
    formType,
    error: state.error,
    currentUser: state.session.currentUser,
  });
};

const mapDispatchToProps = (dispatch, ownProps) => {
  let action = ownProps.match.path === '/signup' ? createUser : createSession;
  return ({
    action: user => dispatch(action(user)),
    clearError: () => dispatch(clearError()),
  });
};

export default withAuth(connect(mapStateToProps, mapDispatchToProps)(SessionForm));
