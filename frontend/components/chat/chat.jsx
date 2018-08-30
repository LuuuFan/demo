import React from 'react';
// import Websocket from 'react-websocket';
import Channel from './channel';
import socketIOClient from "socket.io-client";

// const userList = ['Pavan', 'Tirth', 'Sam', 'Edward', 'Tim', 'Kelvin', 'Julia', 'Lu'];
const userList = ['Pavan', 'Tirth', 'Shasha', ];
class Chat extends React.Component {
	constructor(){
		super();
		this.state = {
			connected: false,
			active: false,
			input: '',
			userList: userList,
		};
		this.socket = null;
	}

	componentDidMount(){
		this.socket = socketIOClient("http://localhost:10000");
		this.socket.emit('online', {username: this.props.currentUser.username});
		this.socket.on('my response', (res) => {
			if (res.data === 'Connected') {
				this.setState({connected: true})
				this.socket.on('receive', (data) => {
					this.props.receiveChatMessage(data.from, data.text, 0);
				})
			} else {
				this.setState({connected: false})
			}
		})
	}

	handleInput(){
		return (e) => {
			if (!e.target.value) {
				this.setState({input: e.target.value, userList: userList});
			} else {
				const filterList = userList.filter(el => el.toLowerCase().includes(e.target.value.toLowerCase()));
				this.setState({input: e.target.value, userList: filterList});
			}
		}
	}

	capitalizeStr(str){
		return str[0].toUpperCase() + str.slice(1).toLowerCase();
	}

	handleSubmit(){
			this.props.receiveChannel(this.capitalizeStr(this.state.input))
			this.setState({input: '', userList: userList});
	}

	toggle(){
		this.setState({active: !this.state.active})
	}

	openChannel(e){
		const user = e.currentTarget.textContent.slice(1);
		this.props.receiveChannel(user);
		this.setState({input: '', userList: userList});
	}

	render(){
		const {channel, removeChannel, currentUser, receiveChatMessage, toggleChannel} = this.props;
		return (
			<div className='chat-area'>
				{channel && Object.keys(channel).length ? 
					<div>
						{Object.keys(channel).filter(el => channel[el].status).map((c, idx) => 
							<div key={idx}>
								<Channel 
									idx={idx} 
									user={c} 
									removeChannel={removeChannel} 
									socket={this.socket} 
									currentUser={currentUser} 
									receiveChatMessage={receiveChatMessage} 
									message={channel[c].message}
									active={channel[c].active}
									toggleChannel={toggleChannel}
								/>
							</div>)
						}
					</div>
					: "" }
				<div className={`chat ${this.state.active ? 'chat-active' : ""}`}>
					<div className='header chat-header' onClick={()=>this.toggle()}>
						{this.state.connected ? 
							<i className="fas fa-circle" style={{'color': `${this.state.connected ? 'green' : 'gray'}`}}></i>
						: <img src='static/assets/images/connection.gif'/>}
					</div>
					<div className='userlist'>
						{this.state.userList.map((user, idx) => 
						<div key={idx} className='user' onClick={(e)=>this.openChannel(e)}>
							<div className='avatar'>{user[0]}</div>
							<span>{user}</span>
						</div>)}
					</div>
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