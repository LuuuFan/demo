import React from 'react';
// import 'babel-polyfill';
import { withAuth } from '@okta/okta-react';
import {Link} from 'react-router-dom';
// import {checkSession} from '../../util/okta_util';
import {OKTA_CLIENT_ID} from '../../../config/key';
import SignInWidget from './oktaWidget';

class SessionForm extends React.Component {
	constructor(){
		super();
		this.state = {
			username:'',
			password:'',
			usernameError: '',
			passwordError: '',
			authenticated: null,
			oktaLoading: false,
		};
		this.checkAuthentication = this.checkAuthentication.bind(this);
    // this.checkAuthentication();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
	}

	handleInput(type){
		return (e) => {
			this.setState({[type]: e.target.value, [`${type}Error`]: ''});
		};
	}

	initialOkta(){
		let oktaSignIn = new OktaSignIn({
		  baseUrl: "https://dev-772839.oktapreview.com",
		  clientId: OKTA_CLIENT_ID,
		  redirectUri: 'http://localhost:3000',
		  logo: 'static/assets/images/bluelogo.png',
		  authParams: {
		    issuer: "https://dev-772839.oktapreview.com/oauth2/default",
		    responseType: ['token', 'id_token'],
		    display: 'json',
		    scopes: ['openid', 'email', 'profile', 'address', 'phone'],
		  }
		});
		this.props.receiveOktaSignIn(oktaSignIn);
		return oktaSignIn;
	};

	checkOktaSession(oktaSignIn){
		if (oktaSignIn.token.hasTokensInUrl()) {
		  oktaSignIn.token.parseTokensFromUrl(
		    (res) => {
		    	alert('now we have token in url, handle it');
		      // The tokens are returned in the order requested by `responseType` above
		      var accessToken = res[0];
		      var idToken = res[1]
		      this.props.receiveOktaToken(accessToken, idToken);
		      // Say hello to the person who just signed in:
		      console.log('Hello, ' + idToken.claims.email);

		      // Save the tokens for later use, e.g. if the page gets refreshed:
		      oktaSignIn.tokenManager.add('accessToken', accessToken);
		      oktaSignIn.tokenManager.add('idToken', idToken);

		      // Remove the tokens from the window location hash
		      window.location.hash='';
		    },
		    (err) => {
		      // handle errors as needed
		      console.error(err);
		    }
		  );
		} else {
			oktaSignIn.session.get((res) => {
				if (res.status === 'ACTIVE') {
					this.props.receiveOktaSession(res);
	  			this.props.history.push('/okta');
				} else {
					console.log('render signin window');
					 oktaSignIn.renderEl(
	      		{ el: '#okta-login-container' },
	      		(res) => {
	      			this.props.receiveOktaToken(res[0], res[1]);
	      			this.props.history.push('/okta');
	      		}, (err) => {
	      			console.log('~~~~~~~~~~~~~~~~~');
	      			console.log(err);
	      		}
		      )
				}
			})
		}
	}

	componentDidMount(){
		if (this.props.formType === 'login') {
			if (this.props.okta) {
				this.checkOktaSession(this.props.okta);
				console.log('~~~~~~~~~~~~~~~~~~~~~')
			} else {
				console.log('&&&&&&&&&&&&&&&&&&&&&&&&&')
				const oktaSignIn = this.initialOkta();
				this.checkOktaSession(oktaSignIn);
			}
		}
		// checkSession(oktaSignIn)
		// this.checkAuthentication();
	}

	componentWillUnmount(){
		this.props.okta.remove();
	}

	 async checkAuthentication() {
    const authenticated = await this.props.auth.isAuthenticated();
    if (authenticated !== this.state.authenticated) {
      this.setState({ authenticated });
    }
  }

  componentDidUpdate(prevProps, prevState) {
		// initialOkta();
		if (prevProps.formType !== this.props.formType && this.props.formType === 'login') {
			if (this.props.okta) {
				console.log('******************')
				this.checkOktaSession(this.props.okta);
			} else {
				console.log('++++++++++++++++++++++++++++')
				const oktaSignIn = this.initialOkta();
				this.checkOktaSession(oktaSignIn);
			}
		}
    // this.checkAuthentication();
  }

  // for react 
  async login() {
    // Redirect to '/' after login
    // this.props.login('/')
    this.props.auth.login('/');
  }

  async logout() {
    // Redirect to '/' after logout
    // this.props.logout('/login')
    this.props.auth.logout('/login');
  }


	handleSubmit(e){
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

	onSuccess(res){
		return this.props.auth.redirect({
			sessionToken: res.session.token
		});
	};

	onError(err) {
		console.log('error logging in', err);
	};


	render(){
		const {error, formType, currentUser} = this.props;
		const text = formType === 'signup' ? 'Sign Up' : 'Log In';
		return (
			<div className='session-main'>
				<h2>{text}</h2>
				<div className='session-form'>
					{currentUser && currentUser.message && currentUser.message.startsWith('User') ? 
						<div className='notification'>
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
					<form className='form-signin' onSubmit={(e)=>this.handleSubmit(e)}>
						<div>
							<input id='username' className='form-control' type='text' onChange={this.handleInput('username')}  value={this.state.username} placeholder='username'/>
							<span>{this.state.usernameError}</span>
						</div>
						<div>
							<input id='password' className='form-control' type='password' onChange={this.handleInput('password')} value={this.state.password} placeholder='password'/>
							<span>{this.state.passwordError}</span>
						</div>
						<input type='submit' value={text} align='middle'/>
					</form>
					{formType === 'signup' ?
						<small className='text-muted'>Already have an account? <Link to='/login'>Log In</Link></small>
						:
						<small className='text-muted'>Need an account? <Link to='/signup'>Sign Up</Link></small>
					}
				</div>
				<div className='okta'>
					{
						// <button onClick={this.logout}>Logout</button>
						// <button onClick={this.login}>Login</button>
					}
					<div id="okta-login-container"></div>
				</div>
			</div>
		);
	}
}

export default SessionForm;