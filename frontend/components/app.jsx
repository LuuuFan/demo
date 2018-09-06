import React from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import HomeContainer from './home/home_container';
import SessionFormContainer from './session/session_form_container';
import { Security, ImplicitCallback  } from '@okta/okta-react';
import oktaCallback from './okta_callback';

const config = {
  issuer: 'https://dev-772839.oktapreview.com/oauth2/default',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: '0oag546kkrj3ZXEeW0h7',
}

const App = () => (
  <div className = 'main'>
    <Router>
      <Security 
        issuer={config.issuer}
        client_id={config.client_id}
        redirect_uri={config.redirect_uri}
      >
        <ProtectedRoute exact path='/' component = { HomeContainer } />
        <AuthRoute path='/signup' component={SessionFormContainer} />
        <AuthRoute path='/login' component={SessionFormContainer} />
        <Route path='/implicit/callback' component={oktaCallback}/>
      </Security>
    </Router>  
  </div>
);

export default App;