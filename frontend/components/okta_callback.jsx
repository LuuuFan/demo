import React from 'react';
import { withAuth } from '@okta/okta-react';

export default withAuth(class oktaCallback extends React.Component {
	constructor(){
		super();
		this.state = {};
	}

	componentDidMount(){
	}	

	async logout() {
    // Redirect to '/' after logout
    // this.props.logout('/login')
    this.props.auth.logout('/login');
  }	

	render(){
		return(
			<div>
				<h1>Login Okta</h1>
				<button onClick={()=>this.logout()}>Logout</button>
			</div>
		);
	}
})

// export default oktaCallback;