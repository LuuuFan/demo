import React from 'react';
import { Route, Switch, Redirect, BrowserRouter as Router } from 'react-router-dom';
import { AuthRoute, ProtectedRoute, OktaRoute } from '../util/route_util';
import HomeContainer from './home/home_container';
import SessionFormContainer from './session/session_form_container';
import { Security, ImplicitCallback  } from '@okta/okta-react';
import OKtaContainer from './okta/okta_container';

const config = {
  issuer: 'https://dev-772839.oktapreview.com/oauth2/default',
  redirect_uri: window.location.origin + '/implicit/callback',
  client_id: '0oag546kkrj3ZXEeW0h7',
}

const App = () => (
  <div className = 'main'>
    <Switch>
      <Security 
        issuer={config.issuer}
        client_id={config.client_id}
        redirect_uri={config.redirect_uri}
      >
        <ProtectedRoute exact path='/' component = { HomeContainer } />
        <AuthRoute path='/signup' component={SessionFormContainer} />
        <AuthRoute path='/login' component={SessionFormContainer} />
        <Route path='/okta' component={OKtaContainer}/>
        <Route path='/implicit/callback' component={ImplicitCallback}/>
      </Security>
    </Switch>  
  </div>
);

export default App;