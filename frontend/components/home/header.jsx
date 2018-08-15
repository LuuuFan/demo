import React from 'react';
import Share from './share';
class Header extends React.Component{


	render(){
		return(
			<header className='navbar navbar-expand navbar-light bg-light'>
				<a href='/'>
					<i className="fab fa-viadeo"></i>
					Demo
				</a>
				<div className='header-buttons'>
					<Share />
				</div>
			</header>

		);
	}
}

export default Header;

