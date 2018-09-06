import {OKTA_CLIENT_ID} from '../../config/key';
import {receiveOktaSignIn, receiveOktaToken} from '../actions/okta';

const initialOkta = () => {
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
	receiveOktaSignIn(oktaSignIn);
	return oktaSignIn;
};

export const checkSession = (oktaSignIn) => {
	if (oktaSignIn.token.hasTokensInUrl()) {
	  oktaSignIn.token.parseTokensFromUrl(
	    function success(res) {
	      // The tokens are returned in the order requested by `responseType` above
	      var accessToken = res[0];
	      var idToken = res[1]

	      // Say hello to the person who just signed in:
	      console.log('Hello, ' + idToken.claims.email);

	      // Save the tokens for later use, e.g. if the page gets refreshed:
	      oktaSignIn.tokenManager.add('accessToken', accessToken);
	      oktaSignIn.tokenManager.add('idToken', idToken);

	      // Remove the tokens from the window location hash
	      window.location.hash='';
	    },
	    function error(err) {
	      // handle errors as needed
	      console.error(err);
	    }
	  );
	} else {
	  oktaSignIn.session.get(function (res) {
	    // Session exists, show logged in state.
	    if (res.status === 'ACTIVE') {
	    	localStorage.setItem('okta', JSON.stringify(res));
	      console.log('Welcome back, ' + res.login);
	      return;
	    }
	    // No session, show the login form
	    oktaSignIn.renderEl(
	      { el: '#okta-login-container' },
	      function success(res) {
	        // Nothing to do in this case, the widget will automatically redirect
	        // the user to Okta for authentication, then back to this page if successful
	      	console.log('********************');
	      	console.log(res);
	      	localStorage.setItem('okta_token', JSON.stringify(res));
	      	receiveOktaToken(res[0], res[1]);
	      },
	      function error(err) {
					console.log('~~~~~~~~~~~~~~~~~~~');		     
	        // handle errors as needed
	        console.error(err);
	      }
	    );
	  });
	}
};