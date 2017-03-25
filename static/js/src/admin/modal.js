export const modal = (props) => {
    console.log('modal method called, props:', props);
    const template = `<div class="nord-modal nord-modal-fade" tabindex="-1" role="dialog" id="nord-modal">
        <form id="modal-edit-form">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">${props.title}</h4>
                    </div>
                    <div class="modal-body">
                        <p>
                            <div class="flex-row">
                                <div class="form-group">
                                    <label>Title</label>
                                    <small><em>Page Title</em></small><br />
                                    <input type="text" name="title" class="form-control" id="title" placeholder="Title" />
                                </div>
                            </div>
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger pull-left" id="item-delete">Delete</button>
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                        <input type="submit" class="btn btn-primary" value="Save Changes" />
                    </div>
                    <div class="modal-confirm" id="modal-confirm">
                        <div class="modal-confirm-message text-warning">
                            Are you sure you want to delete this ${props.targetType}?
                        </div>
                        <div class="modal-confirm-buttons">
                            <button type="button" class="btn btn-danger" id="confirm-delete">Yes - Delete</button>
                            <button type="button" class="btn btn-primary" id="cancel-delete">No - Cancel</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>`;

    const modalDiv = document.createElement('div');
    modalDiv.innerHTML = template;
    document.body.appendChild(modalDiv);
}