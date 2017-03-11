import React from 'react';

const GraphicalMenuItem = (props) => {
    return (
        <a title="Click to edit" className="menuitem-vertical-img openMenuItemModal">
            {props.title}
            <span className="glyphicon glyphicon-pencil edit-icon-right" aria-hidden="true"></span>
        </a>
    )
}

export default GraphicalMenuItem;