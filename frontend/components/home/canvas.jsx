import React from 'react';
// import {fabric} from 'react-fabricjs';
// import {fabric} from '../../util/fabric';
import * as canvasUtil from '../../util/canvas';
import ImageGroup from './image_group';

const colorOptions = ["#000000", "#ffc0cb", "#ffffff", "#008080", "#ffe4e1", "#ff0000", "#ffd700", "#00ffff", "#40e0d0", "#ff7373", "#e6e6fa", "#d3ffce", "#0000ff", "#ffa500", "#f0f8ff", "#b0e0e6", "#7fffd4", "#c6e2ff", "#faebd7", "#800080", "#cccccc", "#eeeeee", "#ffb6c1", "#fa8072", "#800000", "#00ff00", "#333333", "#003366", "#ffff00", "#20b2aa", "#c0c0c0", "#ffc3a0", "#f08080", "#fff68f", "#f6546a", "#468499", "#66cdaa", "#ff6666", "#666666", "#c39797", "#00ced1", "#ffdab9", "#ff00ff", "#660066", "#008000", "#088da5", "#f5f5f5", "#c0d6e4", "#8b0000", "#0e2f44", "#ff7f50", "#afeeee", "#808080", "#990000", "#dddddd", "#b4eeb4", "#ffff66", "#daa520", "#cbbeb5", "#00ff7f", "#f5f5dc", "#8a2be2", "#81d8d0", "#ff4040", "#b6fcd5", "#66cccc", "#794044", "#3399ff", "#a0db8e", "#ccff00", "#cc0000", "#000080", "#3b5998", "#6897bb", "#0099cc", "#999999", "#191970", "#31698a", "#fef65b", "#ff4444", "#ff1493", "#f7f7f7", "#191919", "#6dc066", "#423226", "#4d3727", "#fff8f6", "#701700", "#201104", "#53abb5", "#ffb6b1", "#ff3232", "#c39797", "#e6e6fa", "#40e0d0", "#ffb6b1", "#a8cbfd", "#2f92d7", "#ff3232", "#a8cbfd", "#ccfff1", "#f7e6fd", "#133337", "#113377", "#c4b6c4", "#ac98ac", "#c4b0b0", "#c4b0ba", "#b4abbf", "#256645", "#305130", "#16f1b4", "#f4ebe2", "#edf3f3", "#f6eced", "#f6f2f1", "#f0e3f5", "#f5e1eb", "#f5e8e0", "#fdd5cd", "#e8f2f3", "#edf3f3", "#f6f6f6", "#f6eced", "#f6f2f1", "#f7f5f6"];
let top = 0;

class Canvas extends React.Component{
	
	constructor(){
		super();
		this.state = {
			active: 'Image',
			textSize: '24',
			canvas: {},
			shapeColor: '#000000',
			textColor: '#000000',
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
			canvasIdList: ['0'],
			sideContentToggle: true,
			copy: '',
			prevId: '',
		};
	}

	componentDidMount(){
		this.initializeCanvas(this.state.canvasIdList[0]);
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
		if (prevState.canvasIdList.length < this.state.canvasIdList.length) {
			let id;
			if (this.state.copy) {
				id = this.state.canvasIdList[this.state.canvasIdList.indexOf(this.state.prevId) + 1];
				this.initializeCanvas(`${id}`, this.state.copy);
			} else {
				id = this.state.canvasIdList[this.state.canvasIdList.length - 1];
				this.initializeCanvas(`${id}`);
			}
			this.scroll(id);
		}
	}

	resetCanvas(){
		const defaultCanvas = this.state.canvas['0'];
		this.setState({
			canvasIdList: ['0'],
			canvas: {'0': defaultCanvas},
		});
		canvasUtil.resetCanvas(defaultCanvas);
	}

	initializeCanvas(id, copy, prevId){
		const container = document.querySelector(`.container-${id}`);
		let canvas = new fabric.Canvas(id, {width: 650, height: 650});
		if (container) {
			if (copy) {
				canvas.loadFromJSON(copy.toJSON(), ()=>{
					canvas.renderAll;
				})
			} else {
				canvas.setBackgroundColor('lightgray', canvas.renderAll.bind(canvas));
			}
			this.props.receiveCanvas(id, canvas);
			// refactor later, no need track canvas in component state since already have global state
			this.setState({
				canvas: Object.assign({}, this.state.canvas, {[id]: canvas}),
				selectedCanvas: canvas,
				prevId: '',
				copy: '',
			});
		}
	}

	scroll(id){
		console.log('~~~~~~~~~~~~~~~~')
		console.log($(`#${id}`).offset().top);
		console.log(id)
		$('.canvas-area').animate({
			scrollTop: $(`#${id}`).offset().top
		}, 800)
		// top += $(`#${id}`).offset().top;
		// $('.canvas-area').animate({
		// 	scrollTop: top
		// }, 800);
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
		let id;
		if (e.currentTarget.textContent === 'Image') {
			id = 'side-content-image';
		} else if (e.currentTarget.textContent === 'Bground') {
			id = 'background';
		} else {
			id = e.currentTarget.textContent.toLowerCase();
		}
		this.setState({
			active: e.currentTarget.textContent,
			sideContentToggle: true,
		});
		setTimeout(() => {
			$(`#${id}`).slideUp(1);
			setTimeout(() => {
				$(`#${id}`).slideDown(800);
			}, 400)
		}, 1)
	}

	selectColor(e, type){
		if (type === 'backgroundColor') {
			this.setState({[type]: e.target.style.backgroundColor});
			canvasUtil.changeBackground(e.target.style.backgroundColor, this.state.selectedCanvas);
			return;
		} else {
			this.setState({[type]: e.target.options[e.target.options.selectedIndex].value});
			// this.setState({[type]: e.target.options[e.target.options.selectedIndex].textContent});
		}
		const activeObject = this.state.selectedCanvas.getActiveObject();
		if (activeObject) {
			if (this.state.selectedShape === activeObject.type || 
					(type === 'textColor' && activeObject.type === 'i-text') ||
					(this.state.selectedShape === 'star' && activeObject.type === 'polygon')
				) {
				canvasUtil.changeColor(this.state.selectedCanvas, activeObject, e.target.options[e.target.options.selectedIndex].value);
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
													activeObj.type === 'polygon' ||
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

	addCanvas(copy, prevId){
		const last_el = Array.from(this.state.canvasIdList).sort()[this.state.canvasIdList.length - 1];
		let canvasIdList = Array.from(this.state.canvasIdList)
		if (copy && prevId) {
			const idx = this.state.canvasIdList.indexOf(prevId);
			canvasIdList.splice(idx + 1, 0, last_el * 1 + 1);
		} else {
			canvasIdList.push(last_el * 1 + 1);
		}
		this.setState({
			canvasIdList,
			copy,
			prevId,
		});
	}

	toggleSideContent(){
		this.setState({sideContentToggle: !this.state.sideContentToggle});
	}

	pickColor(e){
		this.setState({backgroundColor: e.target.value});
		canvasUtil.changeBackground(e.target.value, this.state.selectedCanvas);
	}

	moveCanvasUp(e, id){
		const canvasIdList = Array.from(this.state.canvasIdList);
		const idx = canvasIdList.indexOf(id);
		if (idx) {
			[canvasIdList[idx - 1], canvasIdList[idx]] = [canvasIdList[idx], canvasIdList[idx - 1]];
		}
		this.setState({canvasIdList});
	}

	moveCanvasDown(e, id){
		const canvasIdList = Array.from(this.state.canvasIdList);
		const idx = canvasIdList.indexOf(id);
		if (idx < canvasIdList.length - 1) {
			[canvasIdList[idx], canvasIdList[idx + 1]] = [canvasIdList[idx + 1], canvasIdList[idx]]
		}
		this.setState({canvasIdList});
	}

	copyCanvas(e, id){
		this.addCanvas(this.state.canvas[id], id);
	}

	deleteCanvas(e, id){
		if (this.state.canvasIdList.length > 1) {
			const canvas = Object.assign({}, this.state.canvas);
			delete canvas[id];
			const idx = this.state.canvasIdList.indexOf(id);
			const canvasIdList = Array.from(this.state.canvasIdList);
			canvasIdList.splice(idx, 1);
			this.setState({canvas, canvasIdList});
			this.props.removeCanvas(id);
		}
	}



	render(){
		const {receiveSelectedImg, imgs, toggleChat} = this.props;
		return (
			<div className='canvas-main'>
				<ul id="sidebar" role="tablist">
		      <li className={`nav-item sidebar-Image ${this.state.active === 'Image' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
			      <i className="far fa-image"></i>
	          	<div className="nav-text">Image</div>
		      </li>
		      <li className={`nav-item sidebar-Shapes ${this.state.active === 'Shapes' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
		          <i className="fas fa-shapes"></i>
		          <div className="nav-text">Shapes</div>
		      </li>
		      <li className={`nav-item sidebar-Dialog ${this.state.active === 'Dialog' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
		          <i className="fas fa-comment"></i>
		          <div className="nav-text">Dialog</div>
		      </li>
		      <li className={`nav-item sidebar-Text ${this.state.active === 'Text' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
		          <i className="fas fa-font"></i>
		          <div className="nav-text">Text</div>
		      </li>
		      <li className={`nav-item sidebar-Bground ${this.state.active === 'Bground' ? 'selected' : ''}`} onClick={(e)=>this.handleClick(e)}>
		          <i className="fas fa-layer-group"></i>
		          <div className="nav-text">Bground</div>
		      </li>
		      <li className='selected' onClick={()=>toggleChat()}>
		      	<i className="far fa-comments"></i>
		      </li>
		    </ul>
    	<div className='side-content-canvas'>

		    <div className={`tab-content ${this.state.sideContentToggle ? "" : 'collapse'}`} id="side-content" style={{'transform': `translate(${this.state.sideContentToggle ? '0px' : '-320px'})`}}>
		    	<div className='arrow-collapse' onClick={()=>this.toggleSideContent()}>
		    		<div className='ac-inner'>
		    		{ this.state.sideContentToggle ? 
		    			<i className="fas fa-angle-left"></i>
		    			: 
		    			<i className="fas fa-angle-right"></i>}
		    		</div>
		    	</div>
		    	{this.state.active === 'Shapes' ? 
		        <div id="shapes" role="tabpanel" aria-labelledby="shapes-button">
		        	<h2> </h2>
							<ol id="shapes-list" className='group'>
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
								<li className={`shapes-item ${this.state.selectedShape === 'star' ? 'ui-selected' : ''}`} id="star" onClick={(e)=>this.changeShape(e, 'selectedShape')}>
								  <img src="static/assets/images/star.png" />
								</li>
							</ol>
							<div className="form-inline">
								<label htmlFor="shape-color">Color</label>
								<select className="form-control" id="shape-color" onChange={(e)=>this.selectColor(e, 'shapeColor')} style={{'backgroundColor': `${this.state.shapeColor}`}}>
									{colorOptions.map((color, idx) => <option key={idx} style={{'backgroundColor':`${color}`}} value={color} ></option>)}
									{/*
										<option value="black">Black</option>
										<option value="red">Red</option>
										<option value="orange">Orange</option>
										<option value="yellow">Yellow</option>
										<option value="green">Green</option>
										<option value="blue">Blue</option>
										<option value="brown">Brown</option>
										<option value="purple">Purple</option>
										<option value="white">White</option>
										<option value="transparent">Transparent</option>
										<div className="selected-color" style={{backgroundColor: `${this.state.shapeColor}`}}>
										</div>
									*/}
								</select>
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
	            		<button type="button" id="addShape" onClick={()=>canvasUtil.addShape(this.state.selectedShape, this.state.selectedCanvas)}>
	            			Add Shape
	            		</button>
		        	</div>
	        	</div>
		        : ""}
		    	{this.state.active === 'Dialog' ? 
			    	<div id="dialog" role="tabpanel" aria-labelledby='dialog-button'>
							<h2> </h2>
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
		        	<h2> </h2>
							<div className="form-inline">
								<label htmlFor="text-color">Color: </label>
								<select className="form-control" id="text-color" onChange={(e)=>this.selectColor(e, 'textColor')} style={{'backgroundColor': `${this.state.textColor}`}}>
									{colorOptions.map((color, idx) => <option key={idx} style={{'backgroundColor':`${color}`}} value={color} ></option>)}
									{/*
									  <option value="black">Black</option>
									  <option value="red">Red</option>
									  <option value="orange">Orange</option>
									  <option value="yellow">Yellow</option>
									  <option value="green">Green</option>
									  <option value="blue">Blue</option>
									  <option value="brown">Brown</option>
									  <option value="purple">Purple</option>
									  <option value="white">White</option>
										<div className="selected-color" style={{backgroundColor: `${this.state.textColor}`}}></div>
									*/}
								</select>
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
		    	{this.state.active === 'Bground' ? 
		        <div id="background" role="tabpanel" aria-labelledby="background-button">
							<h2> </h2>
							<ul className='group color-options'>
								{colorOptions.map((color, idx) => <li key={idx} style={{'backgroundColor': `${color}`}} onClick={(e)=>this.selectColor(e, 'backgroundColor')}></li>)}
							</ul>
							<div className='form-inline'>
								<label>Pick a color</label>
								<input type='color' onChange={(e)=>this.pickColor(e)}/>
							</div>
							{/*
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
								<div id="button-wrapper">
										<button type="button" id="changeBackground" onClick={()=>canvasUtil.changeBackground(this.state.backgroundColor, this.state.selectedCanvas)}>Change Background Color</button>
								</div>
							*/}
		        </div>
		        : ""}
		    	{this.state.active === 'Image' ? 
		        <div id='side-content-image'>
		        	<ImageGroup receiveSelectedImg={receiveSelectedImg} imgs={imgs}/>
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
		    	{/*
			    	<div className='container container-0' onDoubleClick={()=>this.doubleClick()} onClick={(e)=>this.singleClick(e)}>
							<canvas ref='0' id='0'></canvas>
							<div className='container-sidebar'>
			    			1
			    		</div>
				    </div>
		    	*/}
			    {this.state.canvasIdList.map((id, idx) => 
			    	<div key={id} className={`container container-${id}`} onDoubleClick={()=>this.doubleClick()} onClick={(e)=>this.singleClick(e)}>
			    		<canvas ref={id} id={id}></canvas>
			    		<div className='container-sidebar'>
			    			<i className="fas fa-arrow-up" onClick={(e)=>this.moveCanvasUp(e, id)} style={{'color': `${!idx ? '#cbc5c1' : ''}`}}>
			    				{idx ? <span className='tooltip'>Move Up</span> : ""}
			    			</i>
			    			<span>{idx + 1}</span>
			    			<i className="fas fa-arrow-down" onClick={(e)=>this.moveCanvasDown(e, id)} style={{'color': `${idx < this.state.canvasIdList.length - 1 ? "" : '#cbc5c1'}`}}>
			    				{idx < this.state.canvasIdList.length - 1 ? <span className='tooltip'>Move Down</span> : ""}
			    			</i>
			    			<i className="far fa-copy" onClick={(e)=>this.copyCanvas(e, id)}>
			    				<span className='tooltip'>Copy</span>
			    			</i>
			    			<i className="fas fa-trash" onClick={(e)=>this.deleteCanvas(e, id)} style={{
			    				'color': `${this.state.canvasIdList.length === 1 ? '#cbc5c1' : ''}`
			    			}}>
			    				<span className='tooltip'>Delete</span>
			    			</i>
			    		</div>
			    	</div>)}
			  </div>
			    
		    <div className='buttons'>
		   		<div className='buttons-decoration'></div>
		    	<button onClick={()=>this.addCanvas()}>&#43;
		    		<span className='tooltip'>Add</span>
		    	</button>
		    	<button onClick={()=>this.resetCanvas()}>&times;
		    		<span className='tooltip'>Reset</span>
		    	</button>
		    	{this.state.activeObj ? 
	    			<button className='delete' onClick={()=>canvasUtil.deleteItem(this.state.selectedCanvas)}>
			    		<span className='tooltip'>Delete</span>
	    				<i className="far fa-trash-alt"></i>
	    			</button>
		    		: ""}
	    		{this.state.activeObj &&  this.state.activeObj.type !== 'group' && this.state.activeObj._objects ? 
	    			<button className='group' onClick={()=>this.groupItems()}>
	    				<i className="far fa-object-group"></i>
			    		<span className='tooltip'>Group</span>
	    			</button>
	  			: ""}
	  			{this.state.activeObj && this.state.activeObj.type === 'group' ? 
	    			<button className='ungroup' onClick={()=>this.unGroupItems()}>
			    		<span className='tooltip'>Ungroup</span>
	    				<i className="far fa-object-ungroup"></i>
	    			</button>
	  			: ""}
		    </div>
	   	</div> 
		</div>
		);
	}
}

export default Canvas;