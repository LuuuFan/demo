import React from 'react';


class Channel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			// active: true,
			input: '',
			message: [],
		};
		this.socket = this.props.socket;
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.socket) {
			this.socket = nextProps.socket;
		}
	}

	toggle(e){
		if (e.target.className !== 'close-channel') {
			// this.setState({active: !this.state.active});
			this.props.toggleChannel(this.props.user, !this.props.active);
		}
	}

	closeChannel(){
		this.props.removeChannel(this.props.user);
	}

	handleInput(){
		return (e) => {
			this.setState({input: e.target.value})
		}
	}

	handleSubmit(e){
		e.preventDefault();
		const message = this.state.message.concat([this.state.input]);
		this.socket.emit('send_message', {
			username: this.props.currentUser.username,
			receiver: this.props.user.toLowerCase(),
			message: {text: this.state.input},
		});
		this.props.receiveChatMessage(this.props.user, this.state.input, 1);
		this.setState({input: ''})
	}


	render(){
		const {user, idx, message, active} = this.props;
		return(
			<div className={`channel ${active ? 'channel-active' : ''}`} id={`channel-${user}`} style={{'right': `${260 * (idx + 1)}px`}}>
				<div className='header channel-header' onClick={(e)=>this.toggle(e)}>
					<div>
						<i className="far fa-user"></i>
						<span>{user[0].toUpperCase() + user.slice(1).toLowerCase()}</span>
					</div>
					<span className='close-channel' onClick={()=>this.closeChannel()}>&times;</span>
				</div>
				{ message && Object.keys(message).length ? 
				<div className='message'>
					{Object.keys(message).map(t => <span key={t} className={message[t].type ? '' : 'from'}>{message[t].text}</span>)}
				</div>
				: ""}
				<form onSubmit={(e)=>this.handleSubmit(e)}>
					<input onChange={this.handleInput()} value={this.state.input} placeholder='Type a message'/>
				</form>
			</div>
		);
	}
}

export default Channel;