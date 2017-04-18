import React from 'react';

const Backdrop = (props) => {
    return(
        <div onClick={props.closeSlideout} className={"bg-screen " + (props.display ? "bg-show" : "")} ></div>
    );
}

export default Backdrop;