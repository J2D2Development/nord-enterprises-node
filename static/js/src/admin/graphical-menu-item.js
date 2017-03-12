const GraphicalMenuItem = (props) => {
    return `<a title="Click to edit" class="menuitem-vertical-img openMenuItemModal">${props.title}<span class="glyphicon glyphicon-pencil edit-icon-right" aria-hidden="true"></span></a>`;
}

export default GraphicalMenuItem;