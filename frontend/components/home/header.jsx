import React from 'react';
import ShareContainer from './share_container';
import User from './user';

class Header extends React.Component{

	// alert(){
	// 	alert('dobule click');
	// }

	render(){
		const {receiveImg, sendEmail, message, clearMessage, sendService, canvas, removeCurrentUser} = this.props;
		return(
			<header className='navbar'>
				<a href='/'>
					<img src='static/assets/images/bluelogo.png'/>
					{/*
						<i className="fab fa-viadeo"></i>
					*/}
					Expirements
				</a>
				<div className='header-buttons'>
					<ShareContainer receiveImg={receiveImg} sendEmail={sendEmail} message={message} clearMessage={clearMessage} sendService={sendService} canvas={canvas}/>
				</div>
				<User removeCurrentUser={removeCurrentUser}/>
			</header>

		);
	}
}

export default Header;

