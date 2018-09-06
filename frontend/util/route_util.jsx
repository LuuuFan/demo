import React from 'react';
import {connect} from 'react-redux';
import {withRouter, Route, Redirect} from 'react-router-dom';

const Auth = ({component: Component, path, loggedIn, exact}) => (
  <Route path={path} exact={exact} render={(props) => (
      loggedIn ? (
        <Redirect to='/' />
      ) : (
        <Component {...props} />
      )
    )}
  />
);

const Protected = ({component: Component, path, loggedIn, exact}) => (
  <Route path = {path} exact={exact} render={(props) => (
      loggedIn ? (
        <Component {...props} />
      ) : (
        <Redirect to='/login' />
      )
    )}
  />
);

const Okta = ({component: Component, path, oktaLoggedIn, exact}) => (
  <Route path={path} exact={exact} render={(props) => (
      oktaLoggedIn ? (
        <Component {...props} /> 
      ) : (
        <Redirect to='/login' />
      )
    )}
  />
);


const mapStateToProps = state => ({
  loggedIn: Boolean(state.session.currentUser && state.session.currentUser['access-token']),
  oktaLoggedIn: Boolean((state.okta.accessToken && state.okta.idToken) || state.okta.session),
});

export const AuthRoute = withRouter(connect(mapStateToProps, null)(Auth));
export const OktaRoute = withRouter(connect(mapStateToProps, null)(Okta));
export const ProtectedRoute = withRouter(connect(mapStateToProps, null)(Protected));
