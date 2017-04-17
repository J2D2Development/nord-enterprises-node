import React from 'react';

const TextInput = (props) => {
    return (
        <input type="text" className="form-control" 
            name={props.name} placeholder={props.placeholder} 
            value={props.value}  onChange={props.handleChange}
            data-validators={props.validators}
        />
    );
};

export default TextInput;