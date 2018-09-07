import React from 'react';
import { withAuth } from '@okta/okta-react';
import {OKTA_CLIENT_ID} from '../../../config/key';

class Okta extends React.Component {
	constructor(){
		super();
		this.state = {};
	}

	async logout() {
    const res = await this.props.auth.logout('/login');
    this.props.removeOktaSession();
  }	

	render(){
		return(
			<div>
				<h1>Login Okta</h1>
				<button onClick={()=>this.logout()}>Logout</button>
			</div>
		);
	}
}

export default Okta;