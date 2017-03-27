import React from 'react';

const Modal = (props) => {
    console.log('modal props:', props);
    return (
        <div className="nord-modal nord-modal-fade" tabIndex="-1" role="dialog" id="nord-modal">
            <form id="modal-edit-form" onSubmit={props.submitForm}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => props.closeModal()} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h4 className="modal-title">{props.data.title}</h4>
                        </div>
                        <div className="modal-body">
                            <div className="flex-row">
                                <div className="form-group">
                                    <label>Title</label>
                                    <small><em>Page Title</em></small><br />
                                    <input type="text" name="title" className="form-control" id="title" placeholder="Title" value={props.data.title} onChange={props.handleChange} />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-danger pull-left" 
                                onClick={() => props.showDeleteConfirm()}>
                                Delete
                            </button>
                            <button type="button" className="btn btn-default" 
                                onClick={() => props.closeModal()}>
                                Close
                            </button>
                            <input type="submit" className="btn btn-primary" value="Save Changes" />
                        </div>
                        <div className="modal-confirm" id="modal-confirm">
                            <div className="modal-confirm-message text-warning">
                                Are you sure you want to delete this page?
                            </div>
                            <div className="modal-confirm-buttons">
                                <button type="button" className="btn btn-danger" 
                                    onClick={() => props.deleteItem(window.location.pathname + "/pages/" + props.data.page_id)}>
                                        Yes - Delete
                                </button>
                                <button type="button" className="btn btn-primary" 
                                    onClick={() => props.hideDeleteConfirm()}>
                                        No - Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Modal;