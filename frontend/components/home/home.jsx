import React from 'react';
import SessionFormContainer from '../session/session_form_container';

class Home extends React.Component {
	constructor(){
		super();
		this.state = {};
	}

	componentDidMount(){
		this.props.fetchAllImgs(this.props.currentUser['access-token']);
	}

	render(){
		const {imgs} = this.props;
		return(
			<div>
				<h1>HomePage</h1>
				<div className='img-group'>
					{Object.keys(imgs).map(img => <div><img src=''/></div>)}
				</div>
			</div>
		);
	}
}

export default Home;