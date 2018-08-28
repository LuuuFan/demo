import React from 'react';

class User extends React.Component {
	constructor(){
		super();
		this.state = {};
	}

	logout(){
		localStorage.removeItem('access_token');
		localStorage.removeItem('currentUser');
		this.props.removeCurrentUser();
		setTimeout(()=>{
			this.props.history.push('/login');
		}, 2000)
	}

	render(){
		return(
			<div className='user'>
				<i className="far fa-user"></i>
				{/*<button className="btn" onClick={(e)=>this.logout()}>Log Out</button>*/}
			</div>
		);
	}
}

export default User;