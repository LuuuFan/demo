import React from 'react';

class Share extends React.Component{
	constructor(){
		super();
		this.state = {
			modal: 'modal',
		};
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

	sendFile(){
		const canvas = document.querySelector('#c');
		const imgData = canvas.toDataURL('image/png', 1.0);
		const pdf = new jsPDF();
		pdf.addImage(imgData, 'PNG', 0, 0);
		pdf.save('download.pdf');
		debugger
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
								<input type='email'/>
							</div>
							<div>
								<label>Type: </label>
								<select>
									<option value='pdf'>PDF</option>
									<option value='png'>PNG</option>
								</select>
							</div>
							<button type='submit' className="btn btn-outline-primary btn-sm" onClick={()=>this.sendFile()}>Send</button>
						</form>
					</div>
            		<div onClick={()=>this.closeModal()} className="modal-screen"></div>
				</div>
			</div>
		);
	}
}

export default Share;