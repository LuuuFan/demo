import React from 'react';
import Websocket from 'react-websocket';
import Channel from './channel';

const userList = ['Pavan', 'Tirth', 'Sam', 'Edward', 'Tim', 'Kelvin', 'Julia', 'Lu'];
class Chat extends React.Component {
	constructor(){
		super();
		this.state = {
			active: false,
			input: '',
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
		const {channel, removeChannel} = this.props;
		return (
			<div className='chat-area'>
				{Object.keys(channel).map((c, idx) => <Channel key={idx} idx={idx} user={c} removeChannel={removeChannel}/>)}
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