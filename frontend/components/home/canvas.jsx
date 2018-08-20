import React from 'react';
// import {fabric} from 'react-fabricjs';
// import {fabric} from '../../util/fabric';
import * as canvasUtil from '../../util/canvas';

class Canvas extends React.Component{
	
	constructor(){
		super();
		this.state = {
			active: 'Shapes',
			textSize: '24',
			canvas: {},
			shapeColor: 'Black',
			textColor: 'Black',
			backgroundColor: 'lightgray',
			selectedShape: 'circle',
			selectedDialog: 'dialog_1',
			backgroundImg: {
				height: 0,
				width: 0,
			},
			fillChecked: false,
			activeObj: null,
		};
	}

	componentDidMount(){
		const container = document.querySelector('.container');
		let canvas = new fabric.Canvas("c", {width: container.offsetWidth - 50, height: container.offsetHeight});
		canvas.setBackgroundColor('lightgray', canvas.renderAll.bind(canvas));
		this.setState({canvas: canvas});

		// canvas not working in redux
		// this.props.receiveCanvas(canvas);
		
		// set activeObject, 
		canvas.on('mouse:down', (e)=>{
			let activeObj = canvas.getActiveObject();
			if (activeObj) {
				canvas.bringToFront(activeObj);
				this.setState({activeObj});
			} else {
				this.setState({activeObj: null});
			}
		})

		// delete item on canvas
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Backspace' || e.key === 'Delete') {
				canvasUtil.deleteItem(this.state.canvas);				
			}
		});

	}

	componentWillReceiveProps(nextProps){
		if (nextProps.img && nextProps.img !== this.props.img) {
			canvasUtil.addPhoto(nextProps.img, this.state.canvas);
		}
	}

	doubleClick(){
		const activeObj = this.state.canvas.getActiveObject();
		if (activeObj && activeObj.type === 'group') {
			canvasUtil.changeDialog(this.state.canvas, activeObj);
		}
	}	

	handleInput(){
		return (e) => {
			this.setState({textSize: e.target.value});
			const activeObj = this.state.canvas.getActiveObject();
			if (activeObj && activeObj.type === 'i-text') {
				canvasUtil.changeTextStyle(activeObj, this.state.canvas, null, e.target.value);
			}
		};
	}

	handleClick(e){
		e.preventDefault();	
		this.setState({active: e.currentTarget.textContent});
	}

	selectColor(e, type){
		this.setState({[type]: e.target.options[e.target.options.selectedIndex].textContent});
		if (type === 'backgroundColor') {
			canvasUtil.changeBackground(e.target.options[e.target.options.selectedIndex].textContent, this.state.canvas);
			return;
		}
		const activeObject = this.state.canvas.getActiveObject();
		if (activeObject) {
			if (this.state.selectedShape === activeObject.type || (type === 'textColor' && activeObject.type === 'i-text')) {
				canvasUtil.changeColor(this.state.canvas, activeObject, e.target.options[e.target.options.selectedIndex].textContent);
			}
		}
	}

	changeShape(e, type){
		this.setState({[type]: e.currentTarget.id});
	}

	changeStyle(e){
		const activeObj = this.state.canvas.getActiveObject();
		if (activeObj && activeObj.type === 'i-text') {
			canvasUtil.changeTextStyle(activeObj, this.state.canvas, e.target.value);
		}
	}

	changeOpacity(e){
		const activeObj = this.state.canvas.getActiveObject();
		if (this.isShape(activeObj)) {
			canvasUtil.changeOpacity(activeObj, this.state.canvas, e.target.value * 1);
		}
	}

	checkBox(e){
		const activeObj = this.state.canvas.getActiveObject();
		this.setState({fillChecked: e.target.checked});
		if (this.isShape(activeObj)) {
			canvasUtil.changeFill(activeObj, this.state.canvas, e.target.checked);
		}
	}

	isShape(activeObj){
		return activeObj && (activeObj.type === 'circle' || 
													activeObj.type === 'rect' || 
													activeObj.type === 'line')
	}

	groupItems(){
		const objArr = Array.from(this.state.activeObj._objects);
		let left = Number.MAX_SAFE_INTEGER, top = Number.MAX_SAFE_INTEGER;
		objArr.forEach(obj => {
			if (obj.left && obj.left < left) left = obj.left;
			if (obj.top && obj.top < top) top = obj.top;
		})
		const group = new fabric.Group(objArr, {
			left: left,
			top: top,
		});
		objArr.forEach(obj => this.state.canvas.remove(obj));
		this.state.canvas.add(group);
		this.state.canvas.setActiveObject(group);
		this.setState({activeObj: group});
	}

	unGroupItems(){
		this.state.activeObj.toActiveSelection();
		this.setState({activeObj: this.state.canvas.getActiveObject()});
	}

	render(){
		return (
			<div className='canvas-main'>
				<ul id="sidebar" role="tablist">
		      <li className={`nav-item ${this.state.active === 'Shapes' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
	          <i className="fas fa-shapes"></i>
	          <div className="nav-text">Shapes</div>
		      </li>
		      <li className={`nav-item ${this.state.active === 'Dialog' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
	          <i className="fas fa-comment"></i>
	          <div className="nav-text">Dialog</div>
		      </li>
		      <li className={`nav-item ${this.state.active === 'Text' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
	          <i className="fas fa-font"></i>
	          <div className="nav-text">Text</div>
		      </li>
		      <li className={`nav-item ${this.state.active === 'Image' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
			      <i className="far fa-image"></i>
	          <div className="nav-text">Image</div>
		      </li>
		      <li className={`nav-item ${this.state.active === 'Background' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
		          <i className="fas fa-layer-group"></i>
		          <div className="nav-text">Background</div>
		      </li>
		    </ul>

		    <div className='side-content-canvas'>

		    <div className="tab-content" id="side-content">
		    	{this.state.active === 'Shapes' ? 
	        <div id="shapes" role="tabpanel" aria-labelledby="shapes-button">
						<h2>Shapes</h2>
						<ol id="shapes-list">
							<li className={`shapes-item ${this.state.selectedShape === 'circle' ? 'ui-selected' : ''}`} id="circle" onClick={(e)=>this.changeShape(e, 'selectedShape')}>
							  <img src="app/assets/images/circle.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedShape === 'rect' ? 'ui-selected' : ''}`} id="rect" onClick={(e)=>this.changeShape(e, 'selectedShape')}>
							  <img src="app/assets/images/rect.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedShape === 'line' ? 'ui-selected' : ''}`} id="line" onClick={(e)=>this.changeShape(e, 'selectedShape')}>
							  <img src="app/assets/images/line.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedShape === 'arrow' ? 'ui-selected' : ''}`} id="arrow" onClick={(e)=>this.changeShape(e, 'selectedShape')}>
							  <img src="app/assets/images/arrow.png" />
							</li>
						</ol>
						<div className="form-inline">
							<label htmlFor="shape-color">Color</label>
							<select className="form-control" id="shape-color" onChange={(e)=>this.selectColor(e, 'shapeColor')}>
								<option value="black">Black</option>
								<option value="red">Red</option>
								<option value="orange">Orange</option>
								<option value="yellow">Yellow</option>
								<option value="green">Green</option>
								<option value="blue">Blue</option>
								<option value="brown">Brown</option>
								<option value="purple">Purple</option>
								<option value="white">White</option>
								{/*
									<option value="transparent">Transparent</option>
								*/}
							</select>
							<div className="selected-color" style={{backgroundColor: `${this.state.shapeColor}`}}>
							</div>
						</div>
						<div className="form-inline" id="shape-fill">
							<label>Fill</label>
							<label className="container-checkbox">
							  <input type="checkbox" checked={this.state.fillChecked} onChange={(e)=>this.checkBox(e)} />
							  <span className="checkmark"></span>
							</label>
        		</div>
	        	<div className="form-inline">
	            <label htmlFor="shape-opacity">Opacity: </label>
	            <select className="form-control" id="shape-opacity" onChange={(e)=>this.changeOpacity(e)}>
	              <option value="1">100%</option>
	              <option value=".75">75%</option>
	              <option value=".5">50%</option>
	              <option value=".25">25%</option>
	            </select>
          	</div>
        		<br />
	        	<div id="button-wrapper">
            	<button type="button" id="addShape" onClick={()=>canvasUtil.addShape(this.state.selectedShape, this.state.canvas)}>Add Shape</button>
	        	</div>
	        </div>
	        : ""}
		    	{this.state.active === 'Dialog' ? 
			    <div id="dialog" role="tabpanel" aria-labelledby='dialog-button'>
						<h2>Dialog</h2>
	        	<ol id="shapes-list">
							<li className={`shapes-item ${this.state.selectedDialog === 'dialog_1' ? 'ui-selected' : ''}`} id="dialog_1" onClick={(e)=>this.changeShape(e, 'selectedDialog')}>
							  <img src="app/assets/images/dialog_1.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedDialog === 'dialog_2' ? 'ui-selected' : ''}`} id="dialog_2" onClick={(e)=>this.changeShape(e, 'selectedDialog')}>
							  <img src="app/assets/images/dialog_2.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedDialog === 'dialog_3' ? 'ui-selected' : ''}`} id="dialog_3" onClick={(e)=>this.changeShape(e, 'selectedDialog')}>
							  <img src="app/assets/images/dialog_3.png" />
							</li>
	        	</ol>
        		<textarea placeholder='Add Comment Here'></textarea>
	        	<div id="button-wrapper">
            	<button type="button" id="addDialog" onClick={()=>canvasUtil.addDialog(this.state.selectedDialog, this.state.canvas)}>Add Dialog</button>
	        	</div>
	        </div>
	        : ""}
		    	{this.state.active === 'Text' ? 
	        <div id="text" role="tabpanel" aria-labelledby="text-button">
						<h2>Text</h2>
						<br />
						<div className="form-inline">
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
							<div className="selected-color" style={{backgroundColor: `${this.state.textColor}`}}>
							</div>
          	</div>
          	<br />
						<div className="form-inline">
							<label htmlFor="text-style">Style: </label>
							<select className="form-control" id="text-style" onChange={(e)=>this.changeStyle(e)}>
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
						<div className="form-inline">
							<label htmlFor="text-style">Size(px): &nbsp; </label>
							<input id="text-size" type="number" step="1" min="1" max="50" value={this.state.textSize} onChange={this.handleInput()}/>
						</div>
						<div id="button-wrapper">
							<button type="button" id="addText" onClick={()=>canvasUtil.addText(this.state.canvas)}>Add Text</button>
						</div>
	        </div>
	        : ""}
		    	{this.state.active === 'Background' ? 
	        <div id="background" role="tabpanel" aria-labelledby="background-button">
						<h2>Background Color</h2>
						<div className="form-inline">
							<label htmlFor="background-color">Color: </label>
							<select className="form-control" id="background-color" onChange={(e)=>this.selectColor(e, 'backgroundColor')}>
							  <option value="lightgray">Lightgray</option>
							  <option value="white">White</option>
							  <option value="red">Red</option>
							  <option value="orange">Orange</option>
							  <option value="yellow">Yellow</option>
							  <option value="green">Green</option>
							  <option value="blue">Blue</option>
							  <option value="brown">Brown</option>
							  <option value="purple">Purple</option>
							  <option value="black">Black</option>
							</select>
							<div className="selected-color" style={{backgroundColor: `${this.state.backgroundColor}`}}>
							</div>
						</div>
							{/*
								<br/>
								<div id="button-wrapper">
										<button type="button" id="changeBackground" onClick={()=>canvasUtil.changeBackground(this.state.backgroundColor, this.state.canvas)}>Change Background Color</button>
								</div>
							*/}
	        </div>
	        : ""}
		    	{this.state.active === 'Image' ? 
	        <div id='side-content-image'>
	        	<h2>Image</h2>
	        </div>
	        : ""}

		    </div>

		    	<div className='container' onDoubleClick={()=>this.doubleClick()}>
						<canvas ref='c' id='c' >
						</canvas>
			    </div>
		   	</div> 

		    <div className='buttons'>
		    	<button onClick={()=>canvasUtil.resetCanvas(this.state.canvas)}>Reset Canvas</button>
	    		{this.state.activeObj &&  this.state.activeObj.type !== 'group' && this.state.activeObj._objects ? 
	    			<button onClick={()=>this.groupItems()}>Group Items</button>
    			: ""}
    			{this.state.activeObj && this.state.activeObj.type === 'group' ? 
	    			<button onClick={()=>this.unGroupItems()}>Ungroup Item</button>
    			: ""}
		    </div>
		    
			</div>
		);
	}
}

export default Canvas;