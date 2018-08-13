import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import HomeContainer from './home/home_container';
import SessionFormContainer from './session/session_form_container';

const App = () => (
  <div className = 'main'>
    <Switch>
		<Route exact path='/' component = { HomeContainer } />
		<Route path='/signup' component={SessionFormContainer} />
		<Route path='/login' component={SessionFormContainer} />
    </Switch>  
  </div>
);

export default App;