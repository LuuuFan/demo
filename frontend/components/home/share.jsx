import React from 'react';
import * as canvasUtil from '../../util/canvas';
import Service from '../service';

class Share extends React.Component{
	constructor(){
		super();
		const dropbox = localStorage.getItem('dropbox');
		this.state = {
			modalShare: 'modal',
			modalList: 'modal',
			servicenow: 'modal',
			email: 'lu.fan@n3n.io',
			emailError: '',
			filename: '',
			type: 'pdf',
			sending: false,
			dropbox: dropbox,
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
		this.setState({dropbox});
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
		button.textContent = "";
		const icon = document.createElement('i');
		icon.classList.add('fab');
		icon.classList.add('fa-dropbox');
		const text = document.createElement('span');
		text.textContent = 'Dropbox';
		button.appendChild(icon);
		button.appendChild(text);
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
		if (nextProps.message.message) {
			this.setState({
				servicenow: 'modal',
				modalShare: 'modal',
				sending: false,
			});
			setTimeout(()=>{
					nextProps.clearMessage();
			}, 10000)
		}
	}

	openModal(e, type){
		if (!e.target.className.includes('modal-screen')) {
			this.setState({[type]: 'is-open'});
			Object.keys(this.props.canvas).forEach(key => {
				this.props.canvas[key]
			})
		}

		const canvas = this.props.canvas;
		Object.keys(this.props.canvas).forEach(idx => {
			canvas[idx].setActiveObject(undefined);
		})
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

	extraPDF(){
		const container = document.querySelectorAll('.container');
		const ids = [];
		container.forEach(c => ids.push(c.classList[1].split('-')[1]));
		const imgDataArr = ids.map(id => document.getElementById(id).toDataURL('image/jpeg', 1.0));
		return imgDataArr
	}

	makePDF(){
		const imgDataArr = this.extraPDF();
		const pdf = new jsPDF('l', 'mm', [172, 172]);
		imgDataArr.forEach((imgData, idx) => {
			pdf.addImage(imgData, 'JPEG', 0, 0);
			if (idx !== imgDataArr.length - 1) {
				pdf.addPage();
			}
		});
		return pdf;
	}

	downloadPDF(){
		const pdf = this.makePDF();
		// saving pdf to local
		pdf.save('download.pdf');
	}

	sendFile(){
		if (this.checkEmail()) {
			// const imgData = document.getElementById('0').toDataURL('image/jpeg', 1.0);
			const selector = document.querySelector('.share-canvas select');
			const type = selector.options[selector.selectedIndex].textContent;

			if (type === 'PDF') {
				this.setState({sending: true, modalShare: 'modal'});
				// pdf.setProperties({
			 	//    title: "download",
				// });
				const pdf = this.makePDF();
				const formData = {};
				formData['recipient'] = this.state.email;
				formData['file'] = pdf.output('datauri');
				formData['filename'] = `${this.state.filename || 'download'}.${this.state.type}`;
				const token = JSON.parse(localStorage.getItem('currentUser'))['access-token'];
				// console.log(pdf.output('datauri'));
				// console.log(formData['filename']);

				this.props.sendEmail(token, formData).then(res => {
					this.setState({sending: false});
				}).catch(err => {
					console.log(err);
				});
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
		this.setState({dropbox: ''});
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
		// const dropbox = JSON.parse(localStorage.getItem('dropbox'));
		const {message, sendService, canvas} = this.props;
		return (
			<div className='share'>
				{message.message ? 
					<div className='message'>{message.message}</div>
					: ""}
				{this.state.sending ? <div className='loading'>
					<img src='static/assets/images/sending_email_2.gif' />
				</div> : ""}
				<button className="btn services" onMouseEnter={(e)=>this.openModal(e, 'modalList')} onMouseLeave={()=>this.closeModal('modalList')}>
					<i className="fas fa-server"></i>
					<span>Services</span>
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
					<Service sendService={sendService} canvas={canvas}/>
	 	  		<div onClick={()=>this.closeModal('servicenow')} className="modal-screen"></div>
				</div>
				<button className="btn" onClick={(e)=>this.openModal(e, 'modalShare')}>
					<i className="far fa-share-square"></i>
					<span>Share</span>
				</button>
				<button className='btn' onClick={()=>this.downloadPDF()}>
					<i className="fas fa-download"></i>
					<span>Download</span>
				</button>

				{this.state.dropbox && Object.keys(this.state.dropbox) ? 
				<button className="btn" onClick={()=>this.clearDropbox()}><i className="far fa-trash-alt"></i>Dropbox</button>
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
								<p>   .{this.state.type}</p>
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