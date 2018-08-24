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

	toggle(){
		this.setState({active: !this.state.active});
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
				<div className='header channel-header' onClick={()=>this.toggle()}>
					<i className="far fa-user"></i>
					<span>{user}</span>
					<span className='close-channel'></span>
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