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
			// addPeopleInput: '',
			emojiPage: 1,
			userSearchNotification: '',
			userFilter: [],
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

	// toggle(e){
	// 	if (e.target.className !== 'close-channel' && !e.target.className.includes('fa-plus') && e.target.tagName !== 'INPUT') {
	// 		// this.setState({active: !this.state.active});
	// 		this.props.toggleChannel(this.props.user, !this.props.active);
	// 		this.setState({emojiModal: false});
	// 	}
	// }

	// closeChannel(){
	// 	this.props.removeChannel(this.props.user);
	// }

	handleInput(type){
		return (e) => {
			const userFilter = !e.target.value ? [] : this.props.userList.filter(el => el.includes(e.target.value.toLowerCase()));
			this.setState({
				[type]: e.target.value,
				userSearchNotification: '',
				userFilter,
			})
		}
	}

	handleSubmit(e){
		e.preventDefault();
		if (!this.state.toggleAddPeople) {
			if (this.state.input) {
				this.socket.emit('send_message', {
					username: this.props.currentUser.username,
					receiver: this.props.user,
					// split(' ').map(u => u.toLowerCase()),
					message: {text: this.state.input},
				});
			// const message = this.state.message.concat([this.state.input]);
				this.props.receiveChatMessage(this.props.user, this.state.input, 1);
			}
		} else {
				if (this.validUser(this.state.input)) {
					this.addPeopleToChannel(this.state.input)
				} else {
					this.errorHandleInvalidUser(this.state.input);
				}
		}
		this.setState({input: '', emojiModal: false});
	}

	toggleEmojiModal(){
		this.setState({emojiModal: !this.state.emojiModal, emojiPage: 1});
	}

	selectEmoji(e){
		this.setState({input: this.state.input + e.target.textContent})
	}

	toggleAddPeople(){
		if (!this.state.input) {
			this.setState({toggleAddPeople: !this.state.toggleAddPeople});
		} else {
			if (this.validUser(this.state.input)) {
				this.addPeopleToChannel(this.state.input);
			} else {
				this.errorHandleInvalidUser(this.state.input);
			}
		}
	}

	errorHandleInvalidUser(user){
		let userSearchNotification;
		if (user.trim().toLowerCase() === this.props.user) {
			userSearchNotification = 'Duplicate user';
		} else if(user.trim().toLowerCase() === this.props.currentUser.username){
			userSearchNotification = `You are already on board`;
		} else {
			userSearchNotification = `No user named "${user}" found`;
		}
		this.setState({
			userSearchNotification,
			input: '',
		})
	}

	validUser(user){
		return this.props.userList.includes(user.trim().toLowerCase()) && user.trim().toLowerCase() !== this.props.user
	}

	addPeopleToChannel(newUser){
		this.props.receiveChannel(`${this.props.user} ${newUser.trim().toLowerCase()}`);
		this.setState({
			toggleAddPeople: false,
			input: '',
			userFilter: [],
		});
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
		const {user, message, active, chatActive, userList} = this.props;
		return(
			<div 
				className={`channel ${active ? 'channel-active' : ''}`} 
				id={`channel-${user.split(' ').join('&')}`}
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
				{this.state.userFilter.length ? 
					<div className='user-list'>
						{this.state.userFilter.map(u => <p onClick={(e)=>this.addPeopleToChannel(e.target.textContent)}><i className="far fa-user"></i>{u}</p>)}
					</div>
				: ""}
				{this.state.userSearchNotification ? <div className='notification'>{this.state.userSearchNotification}</div> : ""}
				<form onSubmit={(e)=>this.handleSubmit(e)}>
					<input onChange={this.handleInput('input')} value={this.state.input} placeholder={`${this.state.toggleAddPeople ? 'Add user to chat' : 'Type a message'}`}/>
					{this.state.input && !this.state.toggleAddPeople? 
						<i className="far fa-paper-plane" onClick={(e)=>this.handleSubmit(e)}>
							<span className='tooltip'>Send Message</span>
						</i>
					: ""}
					<i className="fas fa-user-plus" onClick={()=>this.toggleAddPeople()} style={{'color': `${this.state.toggleAddPeople ? '#0099fe' : ''}`}}>
							<span className='tooltip'>Add user</span>
					</i>
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

