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
		this.setState({input: '', emojiModal: false});
	}

	toggleEmojiModal(){
		this.setState({emojiModal: !this.state.emojiModal});
	}

	selectEmoji(e){
		this.setState({input: this.state.input + e.target.textContent})
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
						<div className='emoji group'>
							{emojis.map((e, idx)=> <div key={idx} onClick={(e)=>{this.selectEmoji(e)}}>{e}</div>)}
						</div>
						<div className='modal-screen' onClick={()=>this.toggleEmojiModal()}></div>
					</div>
				</form>
			</div>
		);
	}
}

export default Channel;

const emojis = ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "🙃", "😉", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "☺", "😚", "😙", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "🤥", "😌", "😔", "😪", "🤤", "😴", "😷", "🤒", "🤕", "🤢", "🤮", "🤧", "🥵", "🥶", "🥴", "😵", "🤯", "🤠", "🥳", "😎", "🤓", "🧐", "😕", "😟", "🙁", "☹", "😮", "😯", "😲", "😳", "🥺", "😦", "😧", "😨", "😰", "😥", "😢", "😭", "😱", "😖", "😣", "😞", "😓", "😩", "😫", "😤", "😡", "😠", "🤬", "😈", "👿", "💀", "☠", "💩", "🤡", "👹", "👺", "👻", "👽", "👾"]
