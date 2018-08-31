import React from 'react';
// import Websocket from 'react-websocket';
import Channel from './channel';
import socketIOClient from "socket.io-client";

// const userList = ['Pavan', 'Tirth', 'Sam', 'Edward', 'Tim', 'Kelvin', 'Julia', 'Lu'];
// const userList = ['Pavan', 'Tirth', 'Shasha', ];

class Chat extends React.Component {
	constructor(props){
		super(props);
		let selectChannel;
		if (this.props.channel) {
			selectChannel = Object.keys(this.props.channel).filter(el => this.props.channel[el].status)[0];
		}
		this.state = {
			connected: false,
			chatActive: true,
			input: '',
			userList: [],
			userSearchNotification: '',
			selectChannel: selectChannel || "",
		};
		this.socket = null;
	};

	componentDidMount(){
		// user list
		this.props.getUserList(this.props.currentUser['access-token'])
			.then(()=>this.setState({userList: this.filterUserList(this.props.userList)}))

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

	componentWillReceiveProps(nextProps){
		const nextActiveChannel = Object.keys(nextProps.channel).filter(el => nextProps.channel[el].status);
		const currentActiveChannel = Object.keys(this.props.channel).filter(el => this.props.channel[el].status);
		console.log(nextActiveChannel)
		console.log(currentActiveChannel)
		if (currentActiveChannel.length < nextActiveChannel.length) {
			this.setState({selectChannel: currentActiveChannel[0] || ""});
		}
	}

	componentDidUpdate(prevProps, prevState){
	}


	filterUserList(userList){
		return userList.users[0].filter(u => u != userList['current user'])
	}

	handleInput(){
		return (e) => {
			if (!e.target.value) {
				this.setState({
					input: e.target.value, 
					userList: this.filterUserList(this.props.userList),
					userSearchNotification: "",
				});
			} else {
				const filterList = this.filterUserList(this.props.userList).filter(el => el.toLowerCase().includes(e.target.value.toLowerCase()));
				this.setState({
					input: e.target.value, 
					userList: filterList, 
					userSearchNotification: "",
				});
			}
		}
	}

	capitalizeStr(str){
		return str[0].toUpperCase() + str.slice(1).toLowerCase();
	}

	handleSubmit(){
			if (this.state.userList.length === 1) {
				this.props.receiveChannel(this.state.userList[0])
				this.setState({
					input: '', 
					userList: this.props.users[0].filter(u => u !== this.props.userList['current user']),
					selectChannel: this.capitalizeStr(this.state.userList[0])
				});
			} else if (!this.state.userList.length){
				// No user found
				this.setState({userSearchNotification: `There is no User: "${this.state.input}"`});
			} else {
				// multiple result 
				this.setState({userSearchNotification: 'Please select one user'});
			}
	}

	toggle(){
		// this.setState({active: !this.state.active})
		this.props.toggleChat();
	}

	openChannel(e){
		const user = e.currentTarget.textContent.slice(1).toLowerCase();
		this.props.receiveChannel(user);
		this.setState({
			input: '', 
			userList: this.filterUserList(this.props.userList),
			selectChannel: user,
		});
	}

	toggleChatActive(){
		this.setState({chatActive: !this.state.chatActive})
	}

	selectChannel(e, c){
		this.setState({selectChannel: c});
	}

	removeChannel(e, channel){
		this.props.removeChannel(channel);
		const activeChannels = Object.keys(this.props.channel).filter(c => this.props.channel[c].status);
		const selectChannel = activeChannels[0] || "";
	}

	render(){
		const {channel, removeChannel, currentUser, receiveChatMessage, toggleChannel, active, receiveChannel} = this.props;
		return (
			<div className={`chat-area ${active ? 'chat-area-active' : ''}`}>
				<div className='channel-list'>
					{channel && Object.keys(channel).length ? 
						<ul className='channel-tabs'>
							{Object.keys(channel).filter(el => channel[el].status).map((c, idx) => 
								<li 
									key={idx} 
									data-channelname={c}
									onClick={(e)=>this.selectChannel(e, c)} 
									className={`${this.state.selectChannel === c ? 'selected' : '' }`}
								>
									<i className="fas fa-circle"></i>
									{this.capitalizeStr(c)}
									{this.state.selectChannel === c ? 
										<span onClick={(e)=>this.removeChannel(e, c)}>&times;</span>
									: ""}
								</li>)}
						</ul>
					: ""}
						{channel[this.state.selectChannel] ? 
							<Channel 
								user={this.state.selectChannel}
								socket={this.socket} 
								currentUser={currentUser} 
								receiveChatMessage={receiveChatMessage} 
								toggleChannel={toggleChannel}
								receiveChannel={receiveChannel}
								message={channel[this.state.selectChannel.toLowerCase()].message}
								active={channel[this.state.selectChannel.toLowerCase()].active}
								chatActive={this.state.chatActive}
							/>	
						: ""}
					{/*
						!-- Old Channel --!
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
					*/}	
				</div>
				<div className={`chat ${this.state.chatActive ? 'chat-active' : ""}`}>
					<div className='header chat-header' onClick={()=>this.toggleChatActive()}>
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