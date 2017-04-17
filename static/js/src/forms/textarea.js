import React from 'react';

const TextArea = (props) => {
    return (
        <textarea className="form-control" name={props.name}
            data-validators={props.dataValidators}
            style={{width: 100 + '%'}}
            value={props.value} 
            onChange={props.handleChange}>
        </textarea>
    )
};

export default TextArea;