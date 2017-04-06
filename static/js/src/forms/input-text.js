import React from 'react';

const TextInput = (props) => {
    console.log('textinput props:', props);
    return (
        <input type="text" name="title" className="form-control" id="title" placeholder={props.placeholder} value={props.title}  onChange={props.handleChange} />
    );
};

export default TextInput;