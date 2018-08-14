import React from 'react';
// import {fabric} from 'react-fabricjs';
import {fabric} from '../../util/fabric';

class Canvas extends React.Component{
	
	constructor(){
		super();
		this.state = {
		};
	}

	componentDidMount(){
		let canvas = new fabric.Canvas("c");
		canvas.setBackgroundColor('rgba(255, 73, 64)', canvas.renderAll.bind(canvas));
	}


	render(){
		return (
			<canvas ref='c' id='c'>
			</canvas>
		);
	}
}

export default Canvas;