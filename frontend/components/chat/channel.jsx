import React from 'react';
import {emojis} from '../../util/emoji';

class Channel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			// active: true,
			input: '',
			emojiModal: false,
			toggleAddPeople: false,
			addPeopleInput: '',
		};
		this.socket = this.props.socket;
	}

	componentDidMount(){
		$('.message').animate({
			scrollTop: 9999
		}, 1000);
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
		if (e.target.className !== 'close-channel' && !e.target.className.includes('fa-plus') && e.target.tagName !== 'INPUT') {
			// this.setState({active: !this.state.active});
			this.props.toggleChannel(this.props.user, !this.props.active);
			this.setState({emojiModal: false});
		}
	}

	closeChannel(){
		this.props.removeChannel(this.props.user);
	}

	handleInput(type){
		return (e) => {
			this.setState({[type]: e.target.value})
		}
	}

	handleSubmit(e){
		e.preventDefault();
		// const message = this.state.message.concat([this.state.input]);
		this.socket.emit('send_message', {
			username: this.props.currentUser.username,
			receiver: this.props.user.toLowerCase(),
			// split(' ').map(u => u.toLowerCase()),
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

	toggleAddPeople(){
		this.setState({toggleAddPeople: !this.state.toggleAddPeople});
	}

	addPeopleToChannel(e){
		e.preventDefault;
		this.props.receiveChannel(`${this.state.addPeopleInput} ${this.props.user}`);
		this.setState({
			toggleAddPeople: false,
			addPeopleInput: ''
		})
	}

	capitalizeStr(str){
		return str[0].toUpperCase() + str.slice(1).toLowerCase();
	}


	render(){
		const {user, idx, message, active} = this.props;
		const userList = user.split(' ');
		return(
			<div className={`channel ${active ? 'channel-active' : ''}`} id={`channel-${userList.join('&')}`} style={{'right': `${260 * (idx + 1)}px`}}>
				<div className='header channel-header' onClick={(e)=>this.toggle(e)}>
					<div>
						<i className="far fa-user"></i>
							{userList.length > 3 ? 
								<span>{this.capitalizeStr(userList[0])} and other {userList.length - 1}</span>
								: 
								<span>{userList.map(u => this.capitalizeStr(u)).join(' ')}</span>
							}
					</div>
					<div>
						<i className="fas fa-plus" onClick={()=>this.toggleAddPeople()}>
							<span className='tooltip'>Add user to chat</span>
						</i>
						<span className='close-channel' onClick={()=>this.closeChannel()}>&times;</span>
					</div>
					{this.state.toggleAddPeople ? 
						<form className='add-people' onSubmit={(e)=>this.addPeopleToChannel(e)}>
							<input type='text' value={this.state.addPeopleInput} onChange={this.handleInput('addPeopleInput')} placeholder='Add user to this chat' />
							<input type='submit' value='+'/>
						</form>
					 : ""}
				</div>
				{ message && Object.keys(message).length ? 
				<div className='message'>
					{Object.keys(message).map(t => <span key={t} className={message[t].type ? '' : 'from'}>{message[t].text}</span>)}
				</div>
				: ""}
				<form onSubmit={(e)=>this.handleSubmit(e)}>
					<input onChange={this.handleInput('input')} value={this.state.input} placeholder='Type a message'/>
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

