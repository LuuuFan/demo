import React from 'react';

class Channel extends React.Component{
	constructor(){
		super();
		this.state = {

		};
	}

	render(){
		return(
			<div className='channel' id={this.props.url}></div>
		);
	}
}

export default Channel;