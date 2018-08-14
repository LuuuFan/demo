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
		let canvas = new fabric.Canvas("canvas");
		canvas.setBackgroundColor('rgba(255, 73, 64, 0.6)', canvas.renderAll.bind(canvas));
		console.log(canvas);
		debugger
	}

	componentDidUpdate(){
	}

	render(){
		return (
			<canvas>
			</canvas>
		);
	}
}

export default Canvas;