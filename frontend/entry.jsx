import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore';
import Root from './components/root';

document.addEventListener('DOMContentLoaded', () => {
	

	let preloadedState = {};
	const currentUser = JSON.parse(localStorage.getItem('currentUser'));
	const channel = JSON.parse(localStorage.getItem('channel')) || {selected: ''};
	const accessToken = JSON.parse(localStorage.getItem('oktaAccessToken'));
	const idToken = JSON.parse(localStorage.getItem('oktaIdToken'));
	const session = JSON.parse(localStorage.getItem('oktaSession'));
	if (currentUser) {
		preloadedState['session'] = {currentUser};
	}

	if (accessToken || idToken || session) {
		preloadedState['okta'] = {
			accessToken,
			idToken,
			session,
		};
	}

	if (channel) {
		preloadedState['channel'] = channel;
	}

	const store = configureStore(preloadedState);

	// set up store to window for convenience check state, will delete it later
	window.store = store;

	ReactDOM.render(<Root store={store} />, document.getElementById('root'));
});