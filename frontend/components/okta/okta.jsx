import React from 'react';
import { withAuth } from '@okta/okta-react';
import {OKTA_CLIENT_ID} from '../../../config/key';

class Okta extends React.Component {
	constructor(){
		super();
		this.state = {};
	}

	componentDidMount(){
	}	

	initialOkta(){
		let oktaSignIn = new OktaSignIn({
		  baseUrl: "https://dev-772839.oktapreview.com",
		  clientId: OKTA_CLIENT_ID,
		  redirectUri: 'http://localhost:3000',
		  authParams: {
		    issuer: "https://dev-772839.oktapreview.com/oauth2/default",
		    responseType: ['token', 'id_token'],
		    display: 'json',
		    scopes: ['openid', 'email', 'profile', 'address', 'phone'],
		  }
		});
		return oktaSignIn;
	};


	async logout() {
    // Redirect to '/' after logout
    // this.props.logout('/login')
    // if (this.props.okta) {
	   //  this.props.okta.signOut((res) => {
	   //  	console.log('~~~~~~~~~~~~~~~~~~~')
	   //  	this.props.history.puth('/login');
	   //  }, err => {
    // 		cosole.log(`Please handle error, ${err}`);
	   //  })
    // } else {
    // 	let okta = this.initialOkta();
    // 	okta.signOut((res) => {
	   //  	console.log('**********************')
	   //  	this.props.history.puth('/login');
    // 	}, err => {
    // 		cosole.log(`Please handle error, ${err}`);
    // 	})
    // }
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