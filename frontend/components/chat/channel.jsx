import React from 'react';

class Channel extends React.Component{
	constructor(){
		super();
		this.state = {
			active: true,
			input: '',
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
	}


	render(){
		const {user, idx} = this.props;
		return(
			<div className={`channel ${this.state.active ? 'channel-active' : ''}`} id={this.props.url} style={{'right': `${260 * (idx + 1)}px`}}>
				<div className='header channel-header' onClick={()=>this.toggle()}>
					<i className="far fa-user"></i>
					<span>{user}</span>
				</div>
				<div className='message'>
				</div>
				<form onSubmit={(e)=>this.handleSubmit(e)}>
					<input onChange={this.handleInput()} value={this.state.input}/>
				</form>
			</div>
		);
	}
}

export default Channel;