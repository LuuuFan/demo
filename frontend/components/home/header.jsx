import React from 'react';
import Share from './share';
class Header extends React.Component{


	render(){
		const {receiveImg, sendEmail, message, clearMessage, sendService} = this.props;
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
					<Share receiveImg={receiveImg} sendEmail={sendEmail} message={message} clearMessage={clearMessage} sendService={sendService}/>
				</div>
			</header>

		);
	}
}

export default Header;

