const PageArea = (props) => {
    const areaTitleExists = props.title && props.title !== '&nbsp;';
    const editButton = `<button id="edit-${props.order}" class="edit-button">Edit</button>`;
    let areaTitle = '';
    if(areaTitleExists) {
        areaTitle = `<div>${props.title}<div>`;
    }
    return `<div>${editButton}${areaTitle}<div>${props.area_text}</div></div>`;
}

const AddNewPageArea = () => {
    return `<div><button id="add-page-area" class="add-button">Add</button>Add a page area</div>`;
}

export { PageArea, AddNewPageArea };