import React from 'react';
import SessionFormContainer from '../session/session_form_container';
// import { TheFabric, TheFabricStyle } from 'the-fabric'
import PropTypes from 'prop-types';
import Header from './header';
import Canvas from './canvas';
import ChatContainer from '../chat/chat_container';

var interval;

class Home extends React.Component {
	constructor(){
		super();
		this.state = {
			selectedImgURL: ''
		};
	}

	componentDidMount(){
		this.fetchImg();
		interval = setInterval(()=>this.fetchImg(), 900);
	}

	fetchImg(){
		this.props.fetchAllImgs(this.props.currentUser['access-token'])
			.catch((err)=>{
				clearInterval(interval);
				localStorage.removeItem('access_token');
				this.props.history.push('/login');
			});
	}

	selectImg(e){
		const idx = e.currentTarget.id.split('-')[1] * 1;
		this.setState({selectedImgURL: this.props.imgs[idx].webformatURL});
	}

	render(){
		const {imgs, receiveCanvas, receiveImg, sendEmail, message, clearMessage, sendService, canvas, receiveSelectedImg, selectedImg, removeCurrentUser, currentUser} = this.props;
		return(
			<div>
				<Header 
					receiveImg={receiveImg} 
					sendEmail={sendEmail} 
					message={message} 
					clearMessage={clearMessage} 
					sendService={sendService} 
					canvas={canvas}
					removeCurrentUser={removeCurrentUser}
					currentUser={currentUser}
					/>
				<Canvas 
					receiveCanvas={receiveCanvas} 
					img={selectedImg} 
					message={message}
					imgs={imgs}
					receiveSelectedImg={receiveSelectedImg}/>
				{/*
				<ImageGroup imgs={imgs} receiveSelectedImg={receiveSelectedImg}/>
				<div className='img-group group'>
					{imgs.map((img, key) => 
						<div className='img-container' key={key} id={`img-${key}`} onClick={(e)=>this.selectImg(e)}>
							<img src={img.previewURL}/>
						</div>)}
				</div>
				*/}
				<ChatContainer />
			</div>
		);
	}
}

export default Home;
