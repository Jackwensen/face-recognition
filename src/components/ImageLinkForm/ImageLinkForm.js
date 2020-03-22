import React from 'react';
import './ImageLinkForm.css';

const ImageLinkForm = ({onInputChange, onSubmit}) => {
    return (
        <div>
            <p className='f3'>
                {'This magic brain will detect faces in pictures,Try it!'}
            </p>
            <div className='center'>
                <div className='form center pa4 br3 shadow-3'>
                    <input className='f3 pa2 w-70 center' type='tex' onChange={onInputChange} />
                    <button 
                        className='w-30 grow f4 link ph3 dib white bg-light-purple' 
                        onClick={onSubmit} 
                    >Detect</button>
                </div>
            </div>
            
        </div>
    )
}






export default ImageLinkForm;