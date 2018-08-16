import React from 'react';
import Share from './share';
class Header extends React.Component{


	render(){
		const {receiveImg, sendEmail} = this.props;
		return(
			<header className='navbar navbar-expand navbar-light bg-light'>
				<a href='/'>
					<img src='app/assets/images/favicon.ico'/>
					{/*
						<i className="fab fa-viadeo"></i>
					*/}
					Expirements
				</a>
				<div className='header-buttons'>
					<Share receiveImg={receiveImg} sendEmail={sendEmail}/>
				</div>
			</header>

		);
	}
}

export default Header;

