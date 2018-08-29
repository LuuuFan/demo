import React from 'react';

class ImageGroup extends React.Component {
	constructor(){
		super();
		this.state = {
			selectedImgURL: '',
		}
	}

	selectImg(e){
		const idx = e.currentTarget.id.split('-')[1] * 1;
		this.props.receiveSelectedImg(this.props.imgs[idx].webformatURL);
		// this.setState({selectedImgURL: this.props.imgs[idx].webformatURL});
	}

	render(){
		const {imgs} = this.props
		return(
			<div className='img-group group'>
					{imgs.map((img, key) => 
						<div className='img-container' key={key} id={`img-${key}`} onClick={(e)=>this.selectImg(e)}>
							<img src={img.webformatURL}/>
						</div>)}
				</div>
		);
	}
}

export default ImageGroup;