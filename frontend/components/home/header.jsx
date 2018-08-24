import React from 'react';
import ShareContainer from './share_container';
class Header extends React.Component{

	// alert(){
	// 	alert('dobule click');
	// }

	render(){
		const {receiveImg, sendEmail, message, clearMessage, sendService, canvas} = this.props;
		return(
			<header className='navbar'>
				<a href='/'>
					<img src='app/assets/images/favicon.ico'/>
					{/*
						<i className="fab fa-viadeo"></i>
					*/}
					Expirements
				</a>
				<div className='header-buttons'>
					<ShareContainer receiveImg={receiveImg} sendEmail={sendEmail} message={message} clearMessage={clearMessage} sendService={sendService} canvas={canvas}/>
				</div>
			</header>

		);
	}
}

export default Header;

