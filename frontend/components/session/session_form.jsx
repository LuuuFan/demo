import React from 'react';


class SessionForm extends React.Component {
	constructor(){
		super();
		this.state = {
			username:'',
			password:'',
			usernameError: '',
			passwordError: '',
		};
	}

	handleInput(type){
		return (e) => {
			this.setState({[type]: e.target.value, [`${type}Error`]: ''});
		};
	}


	handleClick(e){
		e.preventDefault();
		if (this.props.error || this.props.error) {
			this.props.clearError();
		}
		if (this.state.username && this.state.password) {
			const user = {username: this.state.username, password: this.state.password};
			this.props.action(user).then((res) => {
				if (this.props.formType === 'signup') {
					if (!res.error) {
						this.props.history.push('/login');
					}
				} else {
					localStorage.setItem('access_token', res.currentUser['access-token']);
					this.props.history.push('/');
				}				
			});
		} else {
			if (!this.state.username && !this.state.password) {
				this.setState({usernameError: 'Please input username', passwordError: 'Please input password'});
			} else {
				!this.state.username ? this.setState({usernameError: 'Please input usernmae'}) : this.setState({passwordError: 'Please input password'}); 
			}
		}
	}

	clearError(){
		this.props.clearError();
	}


	render(){
		const {error, formType, currentUser} = this.props;
		const text = formType === 'signup' ? 'Sign Up' : 'Log In';
		return (
			<div className='session-main'>
				<div className='session-form'>
					<h2>{text}</h2>
					{currentUser && currentUser.message && currentUser.message.startsWith('User') ? <div>
						<span>{currentUser.message}, please login</span>
					</div> : ""}
					{error.error ? 
						<div className='alert alert-danger'>
							<span>{error.error}</span>
							<span onClick={()=>this.clearError()}>&times;</span>
						</div>
					: error.message ?
						<div className='alert alert-danger'>
							<span>{error.message}</span>
							<span onClick={()=>this.clearError()}>&times;</span>
						</div>
					: ""}
					<form className='form-signin'>
						<input id='username' className='form-control' type='text' onChange={this.handleInput('username')}  value={this.state.username} placeholder='username'/>
						<span>{this.state.usernameError}</span>
						<input id='password' className='form-control' type='password' onChange={this.handleInput('password')} value={this.state.password} placeholder='password'/>
						<span>{this.state.passwordError}</span>
						<button className='btn btn-primary' onClick={(e)=>this.handleClick(e)}>{text}</button>
					</form>
					{formType === 'signup' ?
						<small className='text-muted'>Already have an account? <a href='/#/login'>Log In</a></small>
						:
						<small className='text-muted'>Need an account? <a href='/#/signup'>Sign Up</a></small>
					}
				</div>
			</div>
		);
	}
}

export default SessionForm;