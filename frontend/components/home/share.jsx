import React from 'react';
import * as canvasUtil from '../../util/canvas';
import Service from '../service';

class Share extends React.Component{
	constructor(){
		super();
		this.state = {
			modalShare: 'is-open',
			modalList: 'modal',
			servicenow: 'modal',
			email: 'lu.fan@n3n.io',
			emailError: '',
			filename: '',
			type: 'pdf',
		};
	}

	pushToLocal(image){
		const dropbox = JSON.parse(localStorage.getItem('dropbox'));
		if (dropbox) {
			const idx = Object.keys(dropbox).length;
			const newDropbox = Object.assign({}, dropbox, {[`${image.name}`]: image});
			localStorage.setItem('dropbox', JSON.stringify(newDropbox));
		} else {
			localStorage.setItem('dropbox', JSON.stringify({[`${image.name}`]: image}));
		}
	}

	componentDidMount(){
		const button = Dropbox.createChooseButton({
			success: (files)=>{
				files.forEach(img => {
					const link = img.link.split('?')[0];
					const image = {
						name: img.name,
						previewURL: link,
						webformatURL: link,
					};
					this.pushToLocal(image);
					this.props.receiveImg(image);
				})
			},
			cancel: ()=>{
				console.log('user cancel')
			},
			linkType: 'direct',
			multiselect: true,
			extensions: ['.jpg', '.jpeg', '.png', '.gif'],
			folderselect: false,
		});
		button.setAttribute('class', 'btn')
		document.querySelector('.share').appendChild(button);
	}

	componentDidUpdate(){
		$(document).keydown((e)=>{
	      if (e.keyCode === 27) {
	        this.closeModal('servicenow');
	        this.closeModal('modalList');
	        this.closeModal('modalShare');
	      }
	    });
	}

	componentWillReceiveProps(nextProps){
		if (nextProps.message.orderNum) {
			this.setState({servicenow: 'modal'});
			setTimeout(()=>{
					nextProps.clearMessage();
			}, 10000)
		}
	}

	openModal(e, type){
		console.log(e.target.className);
		if (!e.target.className.includes('modal-screen')) {
			this.setState({[type]: 'is-open'});
		}
	}

	closeModal(type){
		this.setState({[type]: 'modal'});
	}

	handleInput(e, type){
		this.setState({[type]: e.target.value, emailError: ''});
	}

	checkEmail(){
		const reg =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return reg.test(String(this.state.email).toLowerCase());
	}

	sendFile(){
		if (this.checkEmail()) {
			const imgData = document.querySelector('#c').toDataURL('image/jpeg', 1.0);
			const selector = document.querySelector('.share-canvas select');
			const type = selector.options[selector.selectedIndex].textContent;
			
			if (type === 'PDF') {
				const pdf = new jsPDF();
				pdf.addImage(imgData, 'JPEG', 0, 0);
				// pdf.setProperties({
			 //    title: "download",
				// });
				const formData = {};
				formData['recipient'] = this.state.email;
				formData['file'] = pdf.output('datauri');
				formData['filename'] = `${this.state.filename || 'download'}.${this.state.type}`;
				const token = localStorage.getItem('access_token');
				// console.log(pdf.output('datauri'));
				console.log(formData['filename']);
				this.props.sendEmail(token, formData);
				// saving pdf to local
				// pdf.save('download.pdf');
			} else {
				const data = imgData.replace(/^data:image\/\w+;base64,/, "");
				const buf = new Buffer(data, 'base64');
				// cannot use native node module like fs, can send binary to backend
			}
		} else {
			this.setState({emailError: 'Please input valid email address'});
		}
	}

	clearDropbox(){
		localStorage.removeItem('dropbox');
		const button = document.querySelector('.dropbox-dropin-success');
		if (button) {
			button.setAttribute('class', 'btn')
		}
	}

	toggleService(){
		this.setState({
			modalList: 'modal',
			servicenow: 'is-open',
		});
	}

	render(){
		const dropbox = JSON.parse(localStorage.getItem('dropbox'));
		const {message, sendService} = this.props;
		return (
			<div className='share'>
				{message.orderNum ? 
					<div className='message'>Service sent successfully. Incident Number: {message.orderNum}</div>
					: ""}
				<button className="btn services" onMouseEnter={(e)=>this.openModal(e, 'modalList')} onMouseLeave={()=>this.closeModal('modalList')}>Send to Service
					<div className={this.state.modalList}>
						<div className='service-list'>
							<ul>
								<li onClick={()=>this.toggleService()}>ServiceNow</li>
							</ul>
						</div>
      			<div onClick={()=>this.closeModal('modalList')} className="modal-screen modal-screen-servicelist"></div>
					</div>
				</button>
				<div className={this.state.servicenow}>
					<Service sendService={sendService}/>
	 	  		<div onClick={()=>this.closeModal('servicenow')} className="modal-screen"></div>
				</div>
				<button className="btn" onClick={(e)=>this.openModal(e, 'modalShare')}>Share</button>
				{dropbox && Object.keys(dropbox) ? 
				<button className="btn" onClick={()=>this.clearDropbox()}>Clear Dropbox</button>
					: ""}
				<div className={this.state.modalShare}>
					<div className='share-canvas'>
						<form onSubmit={()=>this.sendFile()}>
							<div>
								<label>Email: </label>
								<input type='email' onChange={(e)=>this.handleInput(e, 'email')} value={this.state.email}/>
							</div>
							<span>{this.state.emailError}</span>
							<div>
								<label>Filename: </label>
								<input type='text' placeholder='Please input the file name' onChange={(e)=>this.handleInput(e, 'filename')} value={this.state.filename}/>
								<p>.{this.state.type}</p>
							</div>
							<div>
								<label>Type: </label>
								<select onChange={(e)=>this.changeType(e)}>
									<option value='pdf' align='middle'>PDF</option>
									{/*
										<option value='png'>PNG</option>
									*/}
								</select>
							</div>
							<input type='submit' className="btn" value='Send' align='middle'/>
						</form>
					</div>
      		<div onClick={()=>this.closeModal('modalShare')} className="modal-screen"></div>
				</div>
			</div>
		);
	}
}

export default Share;