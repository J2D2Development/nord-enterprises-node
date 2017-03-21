const VerticalMenuItem = (props) => {
    return `<a title="Click to edit" class="${props.menu_style} openMenuItemModal" data-order="${props.order}" data-helptext="${props.help_text}" data-title="${props.title}" data-action="${props.action}" data-actionid="${props.action_id}" data-actionitem="${props.action_item}" data-actionurl="${props.action_url}">${props.title}<span class="glyphicon glyphicon-pencil edit-icon-right" aria-hidden="true"></span></a>`;
}

const AddNewVerticalMenuItem = (style) => {
    return `<a class="${style} openMenuItemModal" id="addnew" title="Add Menu Item">Add Menu Item<span class="glyphicon glyphicon-plus edit-icon-right" aria-hidden="true"></span></a>`
}

export { VerticalMenuItem, AddNewVerticalMenuItem };