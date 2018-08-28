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
			croping: false,
			cropingImg: null,
			selectedCanvas: null,
			extraCanvas: [],
		};
	}

	componentDidMount(){
		this.initializeCanvas('0');

		// canvas not working in redux
		// this.props.receiveCanvas(canvas);
		
		// set activeObject, 
		// canvas.on('mouse:down', (e)=>{
		// 	let activeObj = canvas.getActiveObject();
		// 	if (activeObj) {
		// 		canvas.bringToFront(activeObj);
		// 		this.setState({activeObj});
		// 	} else {
		// 		this.setState({activeObj: null});
		// 	}
		// })

		// delete item on canvas
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Backspace' || e.key === 'Delete') {
				this.setState({activeObj: null});
				canvasUtil.deleteItem(this.state.selectedCanvas);				
			}
		});
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.img && nextProps.img !== this.props.img) {
			canvasUtil.addPhoto(nextProps.img, this.state.selectedCanvas);
		}
		if (nextProps.message.message && nextProps.message.message.startsWith('Email')) {
			this.resetCanvas();
		}
	}

	componentDidUpdate(prevProps, prevState){
		if (prevState.extraCanvas.length !== this.state.extraCanvas.length) {
			const id = this.state.extraCanvas[this.state.extraCanvas.length - 1];
			if (id) {
				this.initializeCanvas(`${id}`);
				this.scroll(id);
			}
		}
	}

	resetCanvas(){
		const defaultCanvas = this.state.canvas['0'];
		this.setState({
			extraCanvas: [],
			canvas: {'0': defaultCanvas},
		});
		canvasUtil.resetCanvas(defaultCanvas);
	}

	initializeCanvas(id){
		const container = document.querySelector(`.container-${id}`);
		if (container) {
			let canvas = new fabric.Canvas(id, {width: 650, height: 650});
			canvas.setBackgroundColor('lightgray', canvas.renderAll.bind(canvas));
			this.props.receiveCanvas(Object.assign({}, this.state.canvas, {[id]: canvas}));
			this.setState({
				canvas: Object.assign({}, this.state.canvas, {[id]: canvas}),
				selectedCanvas: canvas,
			});
		}
	}

	scroll(id){
		$('.canvas-area').animate({
			scrollTop: $(`.container-${id}`).offset().top
		}, 800);
	}

	doubleClick(){
		const activeObj = this.state.selectedCanvas.getActiveObject();
		if (activeObj && activeObj.type === 'group') {
			canvasUtil.changeDialog(this.state.selectedCanvas, activeObj);
		}
	}	

	singleClick(e){
		const id = e.currentTarget.classList[1].split('-')[1];
		const selectedCanvas = this.state.canvas[`${id}`];
		const activeObj = selectedCanvas.getActiveObject();
		if (activeObj) {selectedCanvas.bringToFront(activeObj)};
		console.log(activeObj);
		this.setState({
			activeObj, 
			selectedCanvas,
			});
	}

	handleInput(){
		return (e) => {
			this.setState({textSize: e.target.value});
			const activeObj = this.state.selectedCanvas.getActiveObject();
			if (activeObj && activeObj.type === 'i-text') {
				canvasUtil.changeTextStyle(activeObj, this.state.selectedCanvas, null, e.target.value);
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
			canvasUtil.changeBackground(e.target.options[e.target.options.selectedIndex].textContent, this.state.selectedCanvas);
			return;
		}
		const activeObject = this.state.selectedCanvas.getActiveObject();
		if (activeObject) {
			if (this.state.selectedShape === activeObject.type || (type === 'textColor' && activeObject.type === 'i-text')) {
				canvasUtil.changeColor(this.state.selectedCanvas, activeObject, e.target.options[e.target.options.selectedIndex].textContent);
			}
		}
	}

	changeShape(e, type){
		this.setState({[type]: e.currentTarget.id});
	}

	changeStyle(e){
		const activeObj = this.state.selectedCanvas.getActiveObject();
		if (activeObj && activeObj.type === 'i-text') {
			canvasUtil.changeTextStyle(activeObj, this.state.selectedCanvas, e.target.value);
		}
	}

	changeOpacity(e){
		const activeObj = this.state.selectedCanvas.getActiveObject();
		if (this.isShape(activeObj)) {
			canvasUtil.changeOpacity(activeObj, this.state.selectedCanvas, e.target.value * 1);
		}
	}

	checkBox(e){
		const activeObj = this.state.selectedCanvas.getActiveObject();
		this.setState({fillChecked: e.target.checked});
		if (this.isShape(activeObj)) {
			canvasUtil.changeFill(activeObj, this.state.selectedCanvas, e.target.checked);
		}
	}

	isShape(activeObj){
		return activeObj && (activeObj.type === 'circle' || 
													activeObj.type === 'rect' || 
													activeObj.type === 'polyline' ||
													activeObj.type === 'line')
	}

	groupItems(){
		const objArr = Array.from(this.state.activeObj._objects);
		const group = new fabric.Group(this.state.activeObj._objects);
		objArr.forEach(obj => this.state.selectedCanvas.remove(obj));
		this.state.selectedCanvas.add(group);
		this.state.selectedCanvas.setActiveObject(group);
		this.setState({activeObj: group});
	}

	unGroupItems(){
		this.state.activeObj.toActiveSelection();
		this.setState({activeObj: this.state.selectedCanvas.getActiveObject()});
	}

	croping(){
		canvasUtil.cropingImage(this.state.selectedCanvas, this.state.activeObj);
		this.setState({croping: true, cropingImg: this.state.activeObj});
	}

	doneCrop(){
		canvasUtil.doneCrop(this.state.selectedCanvas, this.state.cropingImg);
		this.setState({croping: false, cropingImg: null});
	}

	cancelCrop(){
		canvasUtil.cancelCrop(this.state.selectedCanvas, this.state.cropingImg);
		this.setState({croping: false, cropingImg: null});
	}

	addCanvas(){
		const last_el = this.state.extraCanvas.length ? this.state.extraCanvas[this.state.extraCanvas.length - 1] : 0;
		this.setState({extraCanvas: this.state.extraCanvas.concat([last_el + 1])});
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
							  <img src="static/assets/images/circle.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedShape === 'rect' ? 'ui-selected' : ''}`} id="rect" onClick={(e)=>this.changeShape(e, 'selectedShape')}>
							  <img src="static/assets/images/rect.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedShape === 'line' ? 'ui-selected' : ''}`} id="line" onClick={(e)=>this.changeShape(e, 'selectedShape')}>
							  <img src="static/assets/images/line.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedShape === 'polyline' ? 'ui-selected' : ''}`} id="polyline" onClick={(e)=>this.changeShape(e, 'selectedShape')}>
							  <img src="static/assets/images/arrow.png" />
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
			        	<div id="button-wrapper">
		            		<button type="button" id="addShape" onClick={()=>canvasUtil.addShape(this.state.selectedShape, this.state.selectedCanvas)}>Add Shape</button>
			        	</div>
			        </div>
			        : ""}
			    	{this.state.active === 'Dialog' ? 
				    <div id="dialog" role="tabpanel" aria-labelledby='dialog-button'>
						<h2>Dialog</h2>
			        	<ol id="shapes-list">
							<li className={`shapes-item ${this.state.selectedDialog === 'dialog_1' ? 'ui-selected' : ''}`} id="dialog_1" onClick={(e)=>this.changeShape(e, 'selectedDialog')}>
							  <img src="static/assets/images/dialog_1.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedDialog === 'dialog_2' ? 'ui-selected' : ''}`} id="dialog_2" onClick={(e)=>this.changeShape(e, 'selectedDialog')}>
							  <img src="static/assets/images/dialog_2.png" />
							</li>
							<li className={`shapes-item ${this.state.selectedDialog === 'dialog_3' ? 'ui-selected' : ''}`} id="dialog_3" onClick={(e)=>this.changeShape(e, 'selectedDialog')}>
							  <img src="static/assets/images/dialog_3.png" />
							</li>
			        	</ol>
		        		<textarea placeholder='Add Comment Here'></textarea>
			        	<div id="button-wrapper">
		            	<button type="button" id="addDialog" onClick={()=>canvasUtil.addDialog(this.state.selectedDialog, this.state.selectedCanvas)}>Add Dialog</button>
			        	</div>
			        </div>
			        : ""}
			    	{this.state.active === 'Text' ? 
			        <div id="text" role="tabpanel" aria-labelledby="text-button">
						<h2>Text</h2>
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
							<div className="selected-color" style={{backgroundColor: `${this.state.textColor}`}}></div>
		          		</div>
						<div className="form-inline">
							<label htmlFor="text-style">Style: </label>
							<select className="form-control" id="text-style" defaultValue='Verdana' onChange={(e)=>this.changeStyle(e)}>
							  <option value="Times">Times</option>
							  <option value="Georgia">Georgia</option>
							  <option value="Arial">Arial</option>
							  <option value="Tahoma">Tahoma</option>
							  <option value="Verdana">Verdana</option>
							  <option value="Courier">Courier</option>
							  <option value="Monaco">Monaco</option>
							</select>
						</div>
						<div className="form-inline">
							<label htmlFor="text-style">Size(px): &nbsp; </label>
							<input id="text-size" type="number" step="1" min="1" max="50" value={this.state.textSize} onChange={this.handleInput()}/>
						</div>
						<div id="button-wrapper">
							<button type="button" id="addText" onClick={()=>canvasUtil.addText(this.state.selectedCanvas)}>Add Text</button>
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
							<div id="button-wrapper">
									<button type="button" id="changeBackground" onClick={()=>canvasUtil.changeBackground(this.state.backgroundColor, this.state.selectedCanvas)}>Change Background Color</button>
							</div>
						*/}
			        </div>
			        : ""}
			    	{this.state.active === 'Image' ? 
			        <div id='side-content-image'>
			        	<h2>Image</h2>
			        	{this.state.activeObj && this.state.activeObj.type === 'image' && !this.state.croping ? 
			        		<div id="button-wrapper">
								<button type="button" id="cropImage" onClick={()=>this.croping()}>
									<i className="fas fa-crop"></i>
									Crop Image
								</button>
								<button type="button" id="rotateImg" onClick={()=>canvasUtil.rotateImg(this.state.selectedCanvas, this.state.activeObj)}>
									<i className="fas fa-sync-alt"></i>
									90&#176; Rotate Image
								</button>
							</div>
			        	: this.state.croping ? 
			        		<div>
			        			<div id="button-wrapper" className='croping'>
									<button type="button" id='done-crop' onClick={()=>this.doneCrop()}>
										<i className="fas fa-check-circle"></i>
										Done
									</button>
								</div>
								<div id="button-wrapper">
									<button type="button" id='cancel-crop' onClick={()=>this.cancelCrop()}>
										<i className="fas fa-ban"></i>
										Cancel
									</button>
								</div>
			        		</div> 
			        	: ""}
			        </div>
			        : ""}
			    </div>

			    <div className='canvas-area'>
			    	<div className='container container-0' onDoubleClick={()=>this.doubleClick()} onClick={(e)=>this.singleClick(e)}>
						<canvas ref='0' id='0'></canvas>
				    </div>
				    {this.state.extraCanvas.map((id, idx) => 
				    	<div key={idx} className={`container container-${id}`} onDoubleClick={()=>this.doubleClick()} onClick={(e)=>this.singleClick(e)}>
				    		<canvas ref={id} id={id}></canvas>
				    	</div>)}
				  </div>
		   	</div> 

		    <div className='buttons'>
		    	<button onClick={()=>this.addCanvas()}>Add Canvas</button>
		    	<button onClick={()=>this.resetCanvas()}>Reset Canvas</button>
		    	{this.state.activeObj ? 
	    			<button onClick={()=>canvasUtil.deleteItem(this.state.selectedCanvas)}>Delete {this.state.activeObj._objects ? 'Items' : 'Item'}</button>
		    		: ""}
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