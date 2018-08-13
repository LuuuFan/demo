import React from 'react';


class SessionForm extends React.Component {
	constructor(){
		super();
		this.state = {
			username:'',
			password:''
		};
	}

	handleInput(type){
		return (e) => {
			this.setState({[type]: e.target.value});
		};
	}


	handleClick(e){
		e.preventDefault();
		this.props.action(this.state);
		this.setState({
			'username': '',
			'email': ''
		});
	}

	render(){
		const text = this.props.formType === 'signup' ? 'Sign Up' : 'Log In';
		return (
			<div className='session-main'>
				<div className='session-form'>
					<form>
						<input id='username' className='form-control' type='text' onChange={this.handleInput('username')}  value={this.state.username} placeholder='username'/>
						<input id='password' className='form-control' type='password' onChange={this.handleInput('password')} value={this.state.password} placeholder='password'/>
						<button className='btn btn-primary' onClick={(e)=>this.handleClick(e)}>{text}</button>
					</form>
				</div>
			</div>
		);
	}
}

export default SessionForm;