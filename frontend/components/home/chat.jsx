import React from 'react';
import Websocket from 'react-websocket';

class Chat extends React.Component {
	constructor(){
		super();
		this.state = {
			active: false
		};
	}

	toggle(){
		this.setState({active: !this.state.active})
	}

	render(){
		return (
			<div className={`chat ${this.state.active ? 'chat-active' : ""}`}>
				<div className='chat-header' onClick={()=>this.toggle()}>

				</div>
			</div>
		);
	}
}


export default Chat;