import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import HomeContainer from './home/home_container';
import SessionFormContainer from './session/session_form_container';

const App = () => (
  <div className = 'main'>
    <Switch>
		<ProtectedRoute exact path='/' component = { HomeContainer } />
		<AuthRoute path='/signup' component={SessionFormContainer} />
		<AuthRoute path='/login' component={SessionFormContainer} />
    </Switch>  
  </div>
);

export default App;