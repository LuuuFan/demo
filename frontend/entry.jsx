import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './store/configureStore';
import Root from './components/root';

document.addEventListener('DOMContentLoaded', () => {
	let preloadedState;
	let token = localStorage.getItem('access_token');
	if (token) {
		preloadedState = {
			session: {
				currentUser: {
					'access-token': token
				}
			}
		};
	}
	const store = configureStore(preloadedState);

	// set up store to window for convenience check state, will delete it later
	window.store = store;

	ReactDOM.render(<Root store={store} />, document.getElementById('root'));
});