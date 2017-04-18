import React from 'react';

const Slideout = (props) => {
    return(
        <div id="main-menu" className={'slideout-right ' + (props.display ? 'slideout-right--show' : '')}>
            <div className="slideout-wrapper">
                <div className="slideout-header">
                    <i onClick={props.closeSlideout} className="fa fa-chevron-circle-left rotatable"></i>
                    <span>Options</span>
                </div>
                <div className="slideout-main">
                    Main stuff
                </div>
                <div className="slideout-footer">
                    <h4>Quicklinks</h4>
                    <div className="slideout__quicklinks">
                        <a href="/admin">Dashboard</a>
                        <a href="http://help.home-owners-assoc.com" target="_blank">Help Site</a>
                        <a href="pages">Pages</a>
                        <a href="features">Features</a>
                        <a href="pages">Users</a>
                        <a href="logout">Log Out</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Slideout;