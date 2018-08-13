import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route_util';
import HomeContainer from './home/home_container';

const App = () => (
  <div className = 'main'>
    <Switch>
      <Route exact path='/' component = { HomeContainer } />
    </Switch>  
  </div>
);

export default App;