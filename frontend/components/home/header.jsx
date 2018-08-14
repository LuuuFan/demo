import React from 'react';

class Header extends React.Component{

	render(){
		return(
			<header className='navbar navbar-expand navbar-light bg-light'>
				<a href='/'>
					<i className="fab fa-viadeo"></i>
					Demo
				</a>
			</header>

		);
	}
}

export default Header;

