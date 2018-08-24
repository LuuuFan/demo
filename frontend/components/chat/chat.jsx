import React from 'react';
import Websocket from 'react-websocket';
import Channel from './channel';

class Chat extends React.Component {
	constructor(){
		super();
		this.state = {
			active: true,
			input: '',
			channel: [],
		};
	}

	handleInput(){
		return (e) => {
			this.setState({input: e.target.value});
		}
	}

	handleSubmit(){
			const channel = this.state.channel.concat([this.state.input]);
			this.setState({channel});
	}

	toggle(){
		this.setState({active: !this.state.active})
	}

	render(){
		return (
			<div className={`chat ${this.state.active ? 'chat-active' : ""}`}>
				{this.state.channel.map(c => <Channel url={c}/>)}
				<div className='chat-header' onClick={()=>this.toggle()}>
					<i className="fas fa-circle" style={{'color': `${this.state.active ? 'green' : 'red'}`}}></i>
				</div>
				<div className='userlist'></div>
				<form onSubmit={()=>this.handleSubmit()}>
					<i className="fas fa-search"></i>
					<input onChange={this.handleInput()} value={this.state.input}/>
				</form>
			</div>
		);
	}
}


export default Chat;