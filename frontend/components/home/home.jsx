
import React from 'react';
import SessionFormContainer from '../session/session_form_container';
// import { TheFabric, TheFabricStyle } from 'the-fabric'
import PropTypes from 'prop-types';
import Header from './header';
import Canvas from './canvas';

class Home extends React.Component {
	constructor(){
		super();
		const s = this;
    	s.vx01 = 1;
		this.state = {};
	}

	componentDidMount(){
		this.props.fetchAllImgs(this.props.currentUser['access-token']);
	}

	render(){
		const s = this;
		const {imgs} = this.props;
		return(
			<div>
				<Header />
				<Canvas />
				<div className='img-group'>
					{Object.keys(imgs).map(img => <div><img src=''/></div>)}
				</div>
			</div>
		);
	}
}

Home.propTypes = {
	optionalBool: PropTypes.bool,
};

export default Home;
