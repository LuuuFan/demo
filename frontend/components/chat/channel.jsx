import React from 'react';


class Channel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			// active: true,
			input: '',
			emojiModal: false,
		};
		this.socket = this.props.socket;
	}

	componentDidMount(){

	}

	componentWillReceiveProps(nextProps){
		if (nextProps.socket) {
			this.socket = nextProps.socket;
		}
	}

	componentDidUpdate(){
		$('.message').animate({
				scrollTop: 9999
			}, 1000);
	}

	toggle(e){
		if (e.target.className !== 'close-channel') {
			// this.setState({active: !this.state.active});
			this.props.toggleChannel(this.props.user, !this.props.active);
			this.setState({emojiModal: false});
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
		// const message = this.state.message.concat([this.state.input]);
		this.socket.emit('send_message', {
			username: this.props.currentUser.username,
			receiver: this.props.user.toLowerCase(),
			message: {text: this.state.input},
		});
		this.props.receiveChatMessage(this.props.user, this.state.input, 1);
		this.setState({input: ''})
	}

	toggleEmojiModal(){
		this.setState({emojiModal: !this.state.emojiModal});
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
					<i className="far fa-smile" onClick={()=>this.toggleEmojiModal()} style={{'color': `${this.state.emojiModal ? '#0099fe' : ''}`}}>
						<span className='tooltip'>Choose emojis</span>
					</i>
					<div className={this.state.emojiModal ? 'is-open' : 'modal'}>
						<div className='emoji'></div>
					</div>
				</form>
			</div>
		);
	}
}

export default Channel;

const smileys = ["U+1F600", "U+1F603", "U+1F604", "U+1F601", "U+1F606", "U+1F605", "U+1F923", "U+1F602", "U+1F642", "U+1F643", "U+1F609", "U+1F60A", "U+1F607", "U+1F970", "U+1F60D", "U+1F929", "U+1F618", "U+1F617", "U+263A", "U+1F61A", "U+1F619", "U+1F60B", "U+1F61B", "U+1F61C", "U+1F92A", "U+1F61D", "U+1F911", "U+1F917", "U+1F92D", "U+1F92B", "U+1F914", "U+1F910", "U+1F928", "U+1F610", "U+1F611", "U+1F636", "U+1F60F", "U+1F612", "U+1F644", "U+1F62C", "U+1F925", "U+1F60C", "U+1F614", "U+1F62A", "U+1F924", "U+1F634", "U+1F637", "U+1F912", "U+1F915", "U+1F922", "U+1F92E", "U+1F927", "U+1F975", "U+1F976", "U+1F974", "U+1F635", "U+1F92F", "U+1F920", "U+1F973", "U+1F60E", "U+1F913", "U+1F9D0", "U+1F615", "U+1F61F", "U+1F641", "U+2639", "U+1F62E", "U+1F62F", "U+1F632", "U+1F633", "U+1F97A", "U+1F626", "U+1F627", "U+1F628", "U+1F630", "U+1F625", "U+1F622", "U+1F62D", "U+1F631", "U+1F616", "U+1F623", "U+1F61E", "U+1F613", "U+1F629", "U+1F62B", "U+1F624", "U+1F621", "U+1F620", "U+1F92C", "U+1F608", "U+1F47F", "U+1F480", "U+2620", "U+1F4A9", "U+1F921", "U+1F479", "U+1F47A", "U+1F47B", "U+1F47D", "U+1F47E", …]