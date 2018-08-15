import React from 'react';

class Share extends React.Component{
	constructor(){
		super();
		this.state = {
			modal: 'modal',
		};
	}

	openModal(){
		this.setState({modal: 'is-open'});
	}

	closeModal(){
		this.setState({modal: 'modal'});
	}

	render(){
		return (
			<div className='share'>
				<button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.openModal()}>Share</button>
				<div className={this.state.modal}>
				</div>
			</div>
		);
	}
}

export default Share;