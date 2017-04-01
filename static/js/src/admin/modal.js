import React from 'react';

const Modal = (props) => {
    const pageAdminOptions = props.pageAdmins.map(user => {
        return(
            <option key={user.username} 
                value={user.username}
                selected={props.data.admin_user === user.username ? 'selected' : ''}>
                {user.first_name} {user.last_name}
            </option>
        );
    });

    let availableUserGroups, currentUserGroups;
    if(props.userGroups) {
        availableUserGroups = props.userGroups.map(group => {
            return(
                <option key={group.group_id} value={group.group_id}>{group.group_title}</option>
            );
        });
        currentUserGroups = props.userGroups.map(group => {
            return(
                <li key={group.group_id}>{group.group_title}</li>
            );
        });
    }

    return (
        <div className="nord-modal nord-modal-fade" tabIndex="-1" role="dialog" id="nord-modal">
            <form id="modal-edit-form" onSubmit={props.submitForm}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" onClick={() => props.closeModal()} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                            <h3 className="modal-title">
                                { props.type === 'create' ? 'Create Page' : 'Edit Page: ' + props.data.title }
                            </h3>
                        </div>
                        <div className="modal-body">
                            <div className="row">
                                <div className="form-group col-sm-4 col-xs-12">
                                    <label className="modal-content-label">Title</label>
                                    <input type="text" name="title" className="form-control" id="title" placeholder="Title" value={props.data.title} onChange={props.handleChange} />
                                </div>
                                <div className="form-group col-sm-4 col-xs-12">
                                    <label className="modal-content-label">Page Admin</label>
                                    <select name="admin_user" className="form-control" 
                                        onChange={props.handleChange}>
                                        <option value="">No Admin Selected</option>
                                        {pageAdminOptions}
                                    </select>
                                </div>
                                <div className="form-group col-sm-4 col-xs-12 custom-radio">
                                    <label className="modal-content-label">Require Password</label>
                                    <input type="radio" 
                                        name="require_auth" value="y" className="yes" id="auth_yes"
                                        checked={props.data.require_auth === 'y' ? 'checked' : ''} 
                                        onChange={props.handleChange} />
                                        <label htmlFor="auth_yes">Yes</label>
                                    &nbsp;&nbsp;&nbsp;
                                    <input type="radio"
                                        name="require_auth" value="n" className="no" id="auth_no"
                                        checked={(!props.data.require_auth || props.data.require_auth === 'n') ? 'checked' : ''} 
                                        onChange={props.handleChange} />
                                        <label htmlFor="auth_no">No</label>
                                </div>
                            </div>
                            {props.data.require_auth === 'y' && props.userGroups &&
                                <div className="row">
                                    <div className="form-group col-sm-4 col-xs-12">
                                        <label className="modal-content-label">Limit Access to User Group</label>
                                        <input type="radio" 
                                            name="require_group_auth" value="y"
                                            checked={props.data.require_group_auth === 'y' ? 'checked' : ''} 
                                            onChange={props.handleChange} />
                                            Yes
                                        <input type="radio"
                                            name="require_group_auth" value="n"
                                            checked={(!props.data.require_group_auth || props.data.require_group_auth === 'n') ? 'checked' : ''} 
                                            onChange={props.handleChange} />
                                            No
                                    </div>
                                    <div className="form-group col-sm-4 col-xs-12">
                                        <label className="modal-content-label">User Groups With Access</label>
                                        <ul>
                                            {currentUserGroups}
                                        </ul>
                                    </div>
                                    <div className="form-group col-sm-4 col-xs-12">
                                        <label className="modal-content-label">Available User Groups</label>
                                        <select name="user_groups" className="form-control" multiple 
                                            onChange={props.handleChange}>
                                            {availableUserGroups}
                                        </select>
                                    </div>
                                </div>
                            }
                            <div className="row">
                                <div className="form-group col-xs-12">
                                    <label className="modal-content-label">Page Description</label>
                                    <textarea className="form-control" name="result_desc" 
                                        style={{width: 100 + '%'}}
                                        value={props.data.result_desc} 
                                        onChange={props.handleChange}>
                                    </textarea>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button"
                                className={ props.type === 'create' ? "hidden" : "btn btn-danger pull-left" } 
                                onClick={() => props.showDeleteConfirm()}>
                                <i className="fa fa-trash-o fa-lg"></i> Delete
                            </button>
                            <button type="button" className="btn btn-default" 
                                onClick={() => props.closeModal()}>
                                <i className="fa fa-ban fa-lg"></i> Cancel
                            </button>
                            <button type="submit" className="btn btn-primary">
                                <i className="fa fa-check fa-lg"></i> Save
                            </button>
                        </div>
                        <div className="modal-confirm" id="modal-confirm">
                            <div className="modal-confirm-message text-warning">
                                Are you sure you want to delete this page?
                            </div>
                            <div className="modal-confirm-buttons">
                                <button type="button" className="btn btn-danger" 
                                    onClick={() => props.deleteItem(props.data.page_id)}>
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

Modal.propTypes = {
    type: React.PropTypes.string.isRequired
};

export default Modal;