import React from 'react';
// import {sendEmail} from '../../util/mail';

class Share extends React.Component{
	constructor(){
		super();
		this.state = {
			modal: 'modal',
			email: 'lu.fan@n3n.io',
			emailError: '',
		};
	}

	download(url, name){
		const a = document.createElement('a');
		a.href = url;
		// a.setAttribute('target', '_blank');
		a.setAttribute("download", name);

		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);

	}

	getSourceAsDOM(url){
		const xmlhttp = new XMLHttpRequest();
		xmlhttp.open('GET', url, false);
		xmlhttp.send();
		parser = new DOMParser();
		return parser.parseFromString(xmlhttp.responseText, 'text/html');
	}

	componentDidMount(){
		const button = Dropbox.createChooseButton({
			success: (files)=>{
				console.log(`Here is the file link: ${files[0].link}`)
				files.forEach(img => {
					const link = img.link.split('?')[0]
					// const html = this.getSourceAsDOM(img.link);
					// debugger
					// const image = new Image();
					// image.src = link;
						// this.download(link, img.name)
					const image = {
						previewURL: link,
						webformatURL: link,
					}
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
		button.setAttribute('class', 'btn btn-outline-primary btn-sm')
		document.querySelector('.share').appendChild(button);
	}

	componentDidUpdate(){
		$(document).keydown((e)=>{
	      if (e.keyCode === 27) {
	        this.closeModal();
	      }
	    });
	}

	openModal(){
		this.setState({modal: 'is-open'});
	}

	closeModal(){
		this.setState({modal: 'modal'});
	}

	handleInput(e){
		this.setState({email: e.target.value, emailError: ''});
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
				pdf.setProperties({
			    title: "download",
				});
				const formData = new FormData();
				formData.append('recipient', this.state.email);
				formData.append('file', pdf.output(), 'download.pdf');
				const token = localStorage.getItem('access_token'); 
				this.props.sendEmail(token, formData);
				// pdf.save('download.pdf');
			} else {
				const data = imgData.replace(/^data:image\/\w+;base64,/, "");
				const buf = new Buffer(data, 'base64');
				// cannot use native node module like fs
			}
		} else {
			this.setState({emailError: 'Please input valid email address'});
		}
	}

	render(){
		return (
			<div className='share'>
				<button type="button" className="btn btn-outline-primary btn-sm" onClick={()=>this.openModal()}>Share</button>
				<div className={this.state.modal}>
					<div className='share-canvas'>
						<form onSubmit={()=>this.sendFile()}>
							<div>
								<label>Email: </label>
								<input type='email' onChange={(e)=>this.handleInput(e)} value={this.state.email}/>
							</div>
							<span>{this.state.emailError}</span>
							<div>
								<label>Type: </label>
								<select>
									<option value='pdf'>PDF</option>
									<option value='png'>PNG</option>
								</select>
							</div>
							<input type='submit' className="btn btn-outline-primary btn-sm" value='Send' />
						</form>
					</div>
            		<div onClick={()=>this.closeModal()} className="modal-screen"></div>
				</div>
			</div>
		);
	}
}

export default Share;