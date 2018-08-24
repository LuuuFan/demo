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
			this.setState({channel, input: ''});
	}

	toggle(){
		this.setState({active: !this.state.active})
	}

	render(){
		return (
			<div className='chat-area'>
				{this.state.channel.map((c, idx) => <Channel key={idx} idx={idx} user={c}/>)}
				<div className={`chat ${this.state.active ? 'chat-active' : ""}`}>
					<div className='header chat-header' onClick={()=>this.toggle()}>
						<i className="fas fa-circle" style={{'color': `${this.state.active ? 'green' : 'gray'}`}}></i>
					</div>
					<div className='userlist'></div>
					<form onSubmit={()=>this.handleSubmit()}>
						<i className="fas fa-search"></i>
						<input onChange={this.handleInput()} value={this.state.input} placeholder='Search user'/>
					</form>
				</div>
			</div>
		);
	}
}


export default Chat;