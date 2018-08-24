import React from 'react';

class Channel extends React.Component{
	constructor(){
		super();
		this.state = {
			active: true,
			input: '',
			message: [],
		};
	}

	toggle(e){
		if (e.target.className !== 'close-channel') {
			this.setState({active: !this.state.active});
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
		this.setState({message, input: ''})
	}


	render(){
		const {user, idx} = this.props;
		return(
			<div className={`channel ${this.state.active ? 'channel-active' : ''}`} id={`channel-${user}`} style={{'right': `${260 * (idx + 1)}px`}}>
				<div className='header channel-header' onClick={(e)=>this.toggle(e)}>
					<div>
						<i className="far fa-user"></i>
						<span>{user}</span>
					</div>
					<span className='close-channel' onClick={()=>this.closeChannel()}>&times;</span>
				</div>
				<div className='message'>
					{this.state.message.map((msg, idx) => <span key={idx}>{msg}</span>)}
				</div>
				<form onSubmit={(e)=>this.handleSubmit(e)}>
					<input onChange={this.handleInput()} value={this.state.input} placeholder='Type a message'/>
				</form>
			</div>
		);
	}
}

export default Channel;