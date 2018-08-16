import React from 'react';
import Share from './share';
class Header extends React.Component{

	componentDidMount(){
		
	}

	render(){
		const {receiveImg, sendEmail} = this.props;
		return(
			<header className='navbar navbar-expand navbar-light bg-light'>
				<a href='/'>
					<i className="fab fa-viadeo"></i>
					Demo
				</a>
				<div className='header-buttons'>
					<Share receiveImg={receiveImg} sendEmail={sendEmail}/>
				</div>
			</header>

		);
	}
}

export default Header;

