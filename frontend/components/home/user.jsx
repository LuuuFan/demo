import React from 'react';

class User extends React.Component {
	constructor(){
		super();
		this.state = {
			toggleDropdown: false,
		};
	}

	toggleDropdown(){
		this.setState({toggleDropdown: !this.state.toggleDropdown});
	}

	logout(){
		localStorage.removeItem('access_token');
		localStorage.removeItem('currentUser');
		localStorage.removeItem('channel');
		this.props.removeCurrentUser();
		setTimeout(()=>{
			this.props.history.push('/login');
		}, 2000)
	}

	render(){
		const {currentUser} = this.props;
		return(
			<div className='user' onClick={()=>this.toggleDropdown()}>
				<i className="far fa-user"></i>
				<div className={`user-dropdown ${this.state.toggleDropdown ? 'is-open' : 'modal'}`}>
					<div className='user-info'>
						<div className='avatar'>
							<i className="far fa-user"></i>
						</div>
						<div className='username'>
							{currentUser && currentUser.username ? currentUser.username : ''}
						</div>
					</div>
					<ul>
						<li><i className="far fa-user"></i>Profile</li>
						<li><i className="fas fa-cog"></i>Account settings</li>
						<li onClick={()=>this.logout()}><i className="fas fa-sign-out-alt"></i>Logout</li>
					</ul>
      		<div onClick={()=>this.toggleDropdown()} className="modal-screen"></div>
				</div>
				{/*<button className="btn" onClick={(e)=>this.logout()}>Log Out</button>*/}
			</div>
		);
	}
}

export default User;