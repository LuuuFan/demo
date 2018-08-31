import React from 'react';
import {emoji} from '../../util/emoji';

class Channel extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			// active: true,
			input: '',
			emojiModal: false,
			toggleAddPeople: false,
			addPeopleInput: '',
			emojiPage: 1,
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

	// closeChannel(){
	// 	this.props.removeChannel(this.props.user);
	// }

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
		this.setState({emojiModal: !this.state.emojiModal, emojiPage: 1});
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

	changePage(n){
		if (this.state.emojiPage  + n > 0 && this.state.emojiPage  + n < 15) {
			this.setState({emojiPage: this.state.emojiPage * 1 + n});
		}
	}

	goToPage(e){
		this.setState({emojiPage: e.target.textContent * 1});
	}


	render(){
		const {user, message, active, chatActive} = this.props;
		const userList = user.split(' ');
		return(
			<div 
				className={`channel ${active ? 'channel-active' : ''}`} 
				id={`channel-${userList.join('&')}`}
				style={{height: `${chatActive ? '71%' : '93%'}`}}
			>
				{/*
					!-- old header --!
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
							<span className='tooltip'>Add user</span>
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
				*/}

				<div className='message'>
					{Object.keys(message).map(t => <span key={t} className={message[t].type ? '' : 'from'}>{message[t].text}</span>)}
				</div>
				<form onSubmit={(e)=>this.handleSubmit(e)}>
					<input onChange={this.handleInput('input')} value={this.state.input} placeholder='Type a message'/>
					<i className="far fa-smile" onClick={()=>this.toggleEmojiModal()} style={{'color': `${this.state.emojiModal ? '#0099fe' : ''}`}}>
						<span className='tooltip'>Choose emojis</span>
					</i>
					<div className={this.state.emojiModal ? 'is-open' : 'modal'}>
						<div className='emoji'>
							<div className='emoji-group group'>
								{emoji[this.state.emojiPage].map((e, idx)=> <div className='emoji-item' key={`emoji-item-${idx}`} onClick={(e)=>{this.selectEmoji(e)}}>{e}</div>)}
							</div>
							{/*
								{Object.keys(emoji).map((key, idx) => <div key={`emoji-key-${idx}`}>{emoji[key].map((e, i)=><div key={`emoji-item-${i}`} className='emoji-item' key={idx} onClick={(e)=>{this.selectEmoji(e)}}>{e}</div>)}</div>)}
							*/}
							<div className='page'>
								<i className="fas fa-chevron-left" onClick={()=>this.changePage(-1)}></i>
								{Object.keys(emoji).map((p, idx) => <span onClick={(e)=>this.goToPage(e)} key={`page-${idx}`} className={this.state.emojiPage == p ? 'selected' : ''}>{p}</span>)}
								<i className="fas fa-chevron-right" onClick={()=>this.changePage(1)}></i>
							</div>
						</div>
						<div className='modal-screen' onClick={()=>this.toggleEmojiModal()}></div>
					</div>
				</form>
			</div>
		);
	}
}

export default Channel;

