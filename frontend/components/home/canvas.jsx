import React from 'react';
// import {fabric} from 'react-fabricjs';
import {fabric} from '../../util/fabric';
import * as canvasUtil from '../../util/canvas';

class Canvas extends React.Component{
	
	constructor(){
		super();
		this.state = {
			active: 'Shapes',
			textSize: '12',
			textColor: 'Black',
			canvas: {},
			backgroundColor: 'white',
		};
	}

	componentDidMount(){
		let canvas = new fabric.Canvas("c");
		canvas.setHeight(320);
		canvas.setHeight(500);
		canvas.setBackgroundColor('lightgray', canvas.renderAll.bind(canvas));
		this.setState({canvas: canvas});
	}

	handleInput(){
		return (e) => {
			this.setState({textSize: e.target.value});
		};
	}

	handleClick(e){
		e.preventDefault();	
		this.setState({active: e.currentTarget.textContent});
	}

	selectColor(e, type){
		this.setState({[type]: e.target.options[e.target.options.selectedIndex].textContent});
	}

	render(){
		return (
			<div className='canvas-container'>
				<ul className="nav nav-tabs" id="sidebar" role="tablist">
			      <li className={`nav-item ${this.state.active === 'Shapes' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
			        <a className="nav-link" id="shapes-button" data-toggle="tab" href="#shapes" aria-controls="shapes" aria-selected="false">
			          <i className="fas fa-shapes"></i>
			          <div className="nav-text">Shapes</div>
			        </a>
			      </li>
			      <li className={`nav-item ${this.state.active === 'Text' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
			        <a className="nav-link" id="text-button" data-toggle="tab" href="#text" aria-controls="text" aria-selected="false">
			          <i className="fas fa-font"></i>
			          <div className="nav-text">Text</div>
			        </a>
			      </li>
			      <li className={`nav-item ${this.state.active === 'Background' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
			        <a className="nav-link" id="background-button" data-toggle="tab" href="#background" aria-controls="background" aria-selected="false">
			          <i className="fas fa-layer-group"></i>
			          <div className="nav-text">Background</div>
			        </a>
			      </li>
			    </ul>

			    <div className="tab-content" id="side-content">
			        <div className={`tab-pane fade ${this.state.active === 'Shapes' ? 'show active' : ""}`} id="shapes" role="tabpanel" aria-labelledby="shapes-button">
						<label>Shapes: </label>
						<ol id="shapes-list">
							<li className="shapes-item" id="circle">
							  <img src="https://raw.githubusercontent.com/Kelvin-K-Cho/edwrd.io/master/public/images/circle.png" />
							</li>
							<li className="shapes-item" id="square">
							  <img src="https://github.com/Kelvin-K-Cho/edwrd.io/blob/master/public/images/square.png?raw=true" />
							</li>
							<li className="shapes-item" id="line">
							  <img src="https://github.com/Kelvin-K-Cho/edwrd.io/blob/master/public/images/line.png?raw=true" />
							</li>
						</ol>
						<div className="form-inline d-flex justify-content-around">
							<label htmlFor="shape-color">Color: </label>
							<select className="form-control" id="shape-color">
							<option value="black">Black</option>
							<option value="red">Red</option>
							<option value="orange">Orange</option>
							<option value="yellow">Yellow</option>
							<option value="green">Green</option>
							<option value="blue">Blue</option>
							<option value="brown">Brown</option>
							<option value="purple">Purple</option>
							<option value="white">White</option>
							</select>
							<div className="selected-color">
							</div>
						</div>
			          	<br />
			        	<div className="form-inline d-flex justify-content-around">
				            <label htmlFor="shape-opacity">Opacity: </label>
				            <select className="form-control" id="shape-opacity">
				              <option value="1">100%</option>
				              <option value=".75">75%</option>
				              <option value=".5">50%</option>
				              <option value=".25">25%</option>
				            </select>
			          	</div>
			          	<br />
			        	<div id="button-wrapper">
			            	<button type="button" className="btn btn-outline-primary btn-sm" id="addShape">Add Shape</button>
			        	</div>
			        </div>
			        <div className={`tab-pane fade ${this.state.active === 'Text' ? 'show active' : ""}`} id="text" role="tabpanel" aria-labelledby="text-button">
						<label>Text: </label>
						<br />
						<div className="form-inline d-flex justify-content-around">
							<label htmlFor="text-color">Color: </label>
							<select className="form-control" id="text-color" onChange={(e)=>this.selectColor(e, 'textColor')}>
							  <option value="black">Black</option>
							  <option value="red">Red</option>
							  <option value="orange">Orange</option>
							  <option value="yellow">Yellow</option>
							  <option value="green">Green</option>
							  <option value="blue">Blue</option>
							  <option value="brown">Brown</option>
							  <option value="purple">Purple</option>
							  <option value="white">White</option>
							</select>
							<div className="selected-color" style={{backgroundColor: `${textColor}`}}>
							</div>
			          	</div>
			          	<br />
						<div className="form-inline d-flex justify-content-around">
						<label htmlFor="text-style">Style: </label>
						<select className="form-control" id="text-style">
						  <option value="Times">Times</option>
						  <option value="Georgia">Georgia</option>
						  <option value="Arial">Arial</option>
						  <option value="Tahoma">Tahoma</option>
						  <option value="Verdana">Verdana</option>
						  <option value="Courier">Courier</option>
						  <option value="Monaco">Monaco</option>
						</select>
						</div>
						<br />
						<div className="form-inline d-flex justify-content-center">
							<label htmlFor="text-size">Size(px): &nbsp; </label>
							<input id="text-size" type="number" step="1" min="1" max="50" value={this.state.textSize} onChange={this.handleInput()}/>
						</div>
						<br />
						<div id="button-wrapper">
							<button type="button" className="btn btn-outline-primary btn-sm" id="addText" onClick={()=>canvasUtil.addText(this.state.canvas)}>Add Text</button>
						</div>
			        </div>
			        <div className={`tab-pane fade ${this.state.active === 'Background' ? 'show active' : ""}`} id="background" role="tabpanel" aria-labelledby="background-button">
						<label>Background-Color: </label>
						<br />
						<div className="form-inline d-flex justify-content-around">
							<label htmlFor="background-color">Color: </label>
							<select className="form-control" id="background-color" onChange={(e)=>this.selectColor(e, 'backgroundColor')}>
							  <option value="white">White</option>
							  <option value="red">Red</option>
							  <option value="orange">Orange</option>
							  <option value="yellow">Yellow</option>
							  <option value="green">Green</option>
							  <option value="blue">Blue</option>
							  <option value="brown">Brown</option>
							  <option value="purple">Purple</option>
							  <option value="black">Black</option>
							  <option value="lightgray">Lightgray</option>
							</select>
							<div className="selected-color" style={{backgroundColor: `${this.state.backgroundColor}`}}>
							</div>
						</div>
						<br/>
						<div id="button-wrapper">
							<button type="button" className="btn btn-outline-primary btn-sm" id="changeBackground" onClick={()=>canvasUtil.changeBackground(this.state.backgroundColor, this.state.canvas)}>Change Background Color</button>
						</div>
			        </div>
			    </div>

				<canvas ref='c' id='c'>
				</canvas>
			</div>
		);
	}
}

export default Canvas;