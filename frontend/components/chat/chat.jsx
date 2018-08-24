import React from 'react';
import Websocket from 'react-websocket';
import Channel from './channel';

const userList = ['Pavan', 'Tirth', 'Sam', 'Edward', 'Tim', 'Kelvin', 'Julia', 'Lu'];
class Chat extends React.Component {
	constructor(){
		super();
		this.state = {
			active: true,
			input: '',
			channel: [],
			userList: userList,
		};
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
		return str[0].toUpperCase() + str.slice(1).toLowerCase;
	}

	handleSubmit(){
			const channel = this.state.channel.concat(this.capitalizeStr([this.state.input]));
			this.setState({channel, input: ''});
	}

	toggle(){
		this.setState({active: !this.state.active})
	}

	openChannel(e){
		const user = e.currentTarget.textContent.slice(1);
		if (!this.state.channel.includes(user)) {
			this.setState({channel: this.state.channel.concat([user])});
		}
	}

	render(){
		return (
			<div className='chat-area'>
				{this.state.channel.map((c, idx) => <Channel key={idx} idx={idx} user={c}/>)}
				<div className={`chat ${this.state.active ? 'chat-active' : ""}`}>
					<div className='header chat-header' onClick={()=>this.toggle()}>
						<i className="fas fa-circle" style={{'color': `${this.state.active ? 'green' : 'gray'}`}}></i>
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