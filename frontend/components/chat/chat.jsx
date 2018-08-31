import React from 'react';
// import Websocket from 'react-websocket';
import Channel from './channel';
import socketIOClient from "socket.io-client";

// const userList = ['Pavan', 'Tirth', 'Sam', 'Edward', 'Tim', 'Kelvin', 'Julia', 'Lu'];
// const userList = ['Pavan', 'Tirth', 'Shasha', ];

class Chat extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			connected: false,
			// active: false,
			input: '',
			userList: [],
			userSearchNotification: ''
		};
		this.socket = null;
	};

	componentDidMount(){
		// user list
		this.props.getUserList(this.props.currentUser['access-token'])
			.then(()=>this.setState({userList: this.props.userList.users[0].filter(u => u != this.props.userList['current user'])}))

		// socket
		this.socket = socketIOClient("http://localhost:10000")
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
				this.setState({
					input: e.target.value, 
					userList: this.props.userList.users[0].filter(u => u !== this.props.userList['current user']),
					userSearchNotification: "",
				});
			} else {
				const filterList = this.state.userList.filter(el => el.toLowerCase().includes(e.target.value.toLowerCase()));
				this.setState({
					input: e.target.value, 
					userList: filterList, 
					userSearchNotification: ""
				});
			}
		}
	}

	capitalizeStr(str){
		return str[0].toUpperCase() + str.slice(1).toLowerCase();
	}

	handleSubmit(){
			if (this.state.userList.length === 1) {
				this.props.receiveChannel(this.capitalizeStr(this.state.userList[0]))
				this.setState({input: '', userList: this.props.users[0].filter(u => u !== this.props.userList['current user'])});
			} else if (!this.state.userList.length){
				// No user found
				this.setState({userSearchNotification: `There is no User: "${this.state.input}"`});
			} else {
				this.setState({userSearchNotification: 'Please select one user'});
			}
	}

	toggle(){
		// this.setState({active: !this.state.active})
		this.props.toggleChat();
	}

	openChannel(e){
		const user = e.currentTarget.textContent.slice(1);
		this.props.receiveChannel(user);
		this.setState({input: '', userList: userList});
	}

	render(){
		const {channel, removeChannel, currentUser, receiveChatMessage, toggleChannel, active, receiveChannel, userList} = this.props;

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
									receiveChannel={receiveChannel}
								/>
							</div>)
						}
					</div>
					: "" }
				<div className={`chat ${active ? 'chat-active' : ""}`}>
					<div className='header chat-header' onClick={()=>this.toggle()}>
						{this.state.connected ? 
							<i className="fas fa-circle" style={{'color': `${this.state.connected ? 'green' : 'gray'}`}}></i>
						: <img src='static/assets/images/connection.gif'/>}
					</div>
					{this.state.userSearchNotification ? 
						<div className='notification'>{this.state.userSearchNotification}</div>
						: ""}
					<div className='userlist'>
						{this.state.userList.map((u, idx) => 
						<div key={idx} className='user' onClick={(e)=>this.openChannel(e)}>
							<div className='avatar'>{u[0].toUpperCase()}</div>
							<span>{this.capitalizeStr(u)}</span>
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