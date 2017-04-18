import React from 'react';

const Slideout = (props) => {
    return(
        <div id="main-menu" className={'slideout-right ' + (props.display ? 'slideout-right--show' : '')}>
            <div className="slideout-top">
                <i onClick={props.closeSlideout} className="fa fa-2x fa-chevron-circle-left rotatable"></i>
                <span>Options</span>
            </div>
            <div className="slideout-main" id="slideout-main">
                <a href="pages">Pages</a>
                <a href="/logout">Log Out</a>
            </div>
        </div>
    );
}

export default Slideout;