const GraphicalMenuItem = (props) => {
    return `<a title="Click to edit" class="menuitem-vertical-img openMenuItemModal" data-helptext="${props.help_text}"
            data-title="${props.title}" data-action="${props.action}" data-actionId="${props.action_id}" data-actionItem="${props.actionItem}">${props.title}<span class="glyphicon glyphicon-pencil edit-icon-right" aria-hidden="true"></span></a>`;
}

const AddNewGraphicalMenuItem = () => {
    return `<a class="menuitem-vertical-img openMenuItemModal" id="addnew" title="Add Menu Item">Add Menu Item<span class="glyphicon glyphicon-plus edit-icon-right" aria-hidden="true"></span></a>`
}

export { GraphicalMenuItem, AddNewGraphicalMenuItem };