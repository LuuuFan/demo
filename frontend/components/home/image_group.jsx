import React from 'react';

class ImageGroup extends React.Component {
	constructor(){
		super();
	}

	render(){
		const {imgs} = this.props
		return(
			<div className='img-group group'>
					{imgs.map((img, key) => 
						<div className='img-container' key={key} id={`img-${key}`} onClick={(e)=>this.selectImg(e)}>
							<img src={img.previewURL}/>
						</div>)}
				</div>
		);
	}
}

export default ImageGroup;