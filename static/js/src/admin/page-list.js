import React, { Component } from 'react';
//import { render } from 'react-dom';
import { notifyr } from './notifyr';
import $ from 'jquery';

import PageListCard from './page-list-card';
import Search from './search';
import Modal from './modal';

export default class PageList extends Component {
    constructor(props) {
        super(props);
        this.type = 'update';
        this.pages = props.pages;
        this.pageAdmins = props.pageAdmins
        this.userGroups = props.userGroups;
        this.openModal = this.openModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.addUserGroup = this.addUserGroup.bind(this);
        this.removeUserGroup = this.removeUserGroup.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.filterPages = this.filterPages.bind(this);
        this.serverSuccess = this.serverSuccess.bind(this);
        this.serverError = this.serverError.bind(this);
        this.newPage = {
            title: '',
            require_auth: 'n',
            require_group_auth: 'n',
            home_page: 'n',
            admin_user: '',
            page_id: 0,
            result_desc: ''
        };

        this.state = {
            pages: this.pages,
            pageInfo: {},
            userGroups: props.userGroups,
            assignedUserGroups: [],
            formType: 'update'
        };
    }

    openModal(type, props) {
        this.type = type;
        let assignedUserGroupsUpdate = [], availableUserGroupsUpdate = [];
        const groups = [...this.state.userGroups];

        if(groups.length > 0) {
            // assignedUserGroupsUpdate = this.state.userGroups.filter(group => {
            //     return group.page_id === props.page_id;
            // });
            // availableUserGroupsUpdate = this.state.userGroups.filter(group => {
            //     return 
            // })
            for(let i = 0, l = groups.length; i < l; i += 1) {
                if(this.state.userGroups[i].page_id === props.page_id) {
                    console.log('group assigned:', groups[i]);
                    assignedUserGroupsUpdate.push(groups[i]);
                } else {
                    console.log('group available:', groups[i]);
                    availableUserGroupsUpdate.push(groups[i]);
                }
            }
        }

        this.setState({
            pageInfo: props,
            formType: type,
            availableUserGroups: availableUserGroupsUpdate,
            assignedUserGroups: assignedUserGroupsUpdate
        });

        document.querySelector('#bg-screen').classList.add('bg-show');
        document.querySelector('#nord-modal').classList.add('modal-show');
    }

    closeModal() {
        document.querySelector('#nord-modal').classList.remove('modal-show');
        document.querySelector('#bg-screen').classList.remove('bg-show');
        this.hideDeleteConfirm();
    }

    showDeleteConfirm() {
        document.querySelector('#modal-confirm').classList.add('slide-down');
    }

    hideDeleteConfirm() {
        document.querySelector('#modal-confirm').classList.remove('slide-down');
    }

    handleChange(evt) {
        let pageInfoUpdate = {};

        for(let item in this.state.pageInfo) {
            if(this.state.pageInfo[item]) {
                pageInfoUpdate[item] = this.state.pageInfo[item]
            }
        }
        pageInfoUpdate[evt.target.name] = evt.target.value;

        this.setState({
            pageInfo: pageInfoUpdate
        });
    }

    addUserGroup(id) {
        console.log('adding this group:', id);

        let currentUserGroups = [...this.state.assignedUserGroups];
        let availableUserGroups = [...this.state.userGroups];
        const groupToAdd = availableUserGroups.find(group => group.group_id = id);

        //!!! remove added group from availableUserGroups on state, update state
        //!!! open modal not resetting user groups list- whole user group functionality currently fucked

        console.log('found group:', groupToAdd);

        currentUserGroups.push(groupToAdd);
        //availableUserGroups = availableUserGroups.filter(group => group.group_id !== id);

        this.setState({
            userGroups: availableUserGroups,
            assignedUserGroups: currentUserGroups
        });
    }

    removeUserGroup(id) {

    }

    submitForm(evt) {
        evt.preventDefault();
        if(this.state.formType === 'edit') {
            this.updateItem(this.state.pageInfo);
        } else {
            this.addItem(this.state.pageInfo);
        }
    }

    refreshPageList() {
        $.get(window.location.pathname + '/pages-list')
            .then(response => {
                this.pages = response.pageList;
                this.setState({
                    pages: this.pages
                });
            })
            .catch(error => {
                this.serverError(error);
            });
    }

    updateItem(item) {
        const url = `${window.location.pathname}/pages-list/${item['page_id']}`;
        $.ajax({
            url: url,
            type: 'PUT',
            dataType: 'json',
            data: item
        })
        .done(response => {
            if(response.success) {
                this.serverSuccess(response.success, response.msg);
            } else {
                this.serverError(response.msg);
            }
        })
        .fail(error => {
            this.serverError(error.msg);
        });
        
    }

    addItem(item) {
        $.post(`${window.location.pathname}/pages-list`, item)
            .done(response => {
                if(response.success) {
                    this.serverSuccess(response.success, response.msg);
                } else {
                    this.serverError(response.msg);
                }
            })
            .fail(error => {
                this.serverError(error.msg);
            })
            .always(() => {
            });
    }

    deleteItem(id) {
        const url = `${window.location.pathname}/pages-list/${id}`;
        console.log('deleting url:', url);
        $.ajax({
            url: url,
            type: 'DELETE',
            dataType: 'json'
        })
        .done(response => {
            console.log('del response');
            if(response.success) {
                this.serverSuccess(response.success, response.msg);
            } else {
                this.serverError(response.msg);
            }
        })
        .fail(error => {
           this.serverError(error.msg);
        })
        .always(() => this.hideDeleteConfirm());
    }

    serverSuccess(status, msg) {
        const type = status ? 'notifyr-success' : 'notifyr-error';
        this.refreshPageList();
        this.closeModal();
        notifyr({ msg: msg, type: type, duration: 3000 });
    }
    serverError(msg) {
        notifyr({ msg: msg, type: 'notifyr-error', duration: 3000 });
    }

    filterPages(evt) {
        let pageInfoFiltered = [...this.pages].filter(page => {
            return page.title.toLowerCase().indexOf(evt.target.value.toLowerCase()) !== -1;
        });

        if(evt.target.value) {
            this.setState({
                pages: pageInfoFiltered
            });
        } else {
            this.setState({
                pages: this.pages
            });
        }
        
    }

    render() {
        return(
            <div>
                <div className="row">
                    <div className="col-xs-6" style={{marginBottom: 16 + 'px'}}>
                        <Search filterPages={this.filterPages} placeholder="Search for a page" />
                    </div>
                    <div className="col-xs-6" style={{marginBottom: 16 + 'px'}}>
                        <button type="button" className="btn btn-primary" onClick={() => this.openModal('create', this.newPage)}>
                            <i className="fa fa-plus fa-lg"></i> Create New Page
                        </button>
                    </div>
                </div>
                {this.state.pages.map(page => {
                    return <PageListCard key={page.page_id} openModal={this.openModal} data={page} />;
                })}
                <Modal type={this.type} data={this.state.pageInfo} closeModal={this.closeModal} showDeleteConfirm={this.showDeleteConfirm} hideDeleteConfirm={this.hideDeleteConfirm} handleChange={this.handleChange} addUserGroup={this.addUserGroup} removeUserGroup={this.removeUserGroup} submitForm={this.submitForm} addItem={this.addItem} updateItem={this.updateItem} deleteItem={this.deleteItem} pageAdmins={this.pageAdmins} availableUserGroups={this.state.userGroups} assignedUserGroups={this.state.assignedUserGroups}  />
            </div>
        );
    }
}

PageList.propTypes = {
    pages: React.PropTypes.array.isRequired,
    pageAdmins: React.PropTypes.array.isRequired,
    userGroups: React.PropTypes.array
};
 
// PageList.defaultProps = {
//     model: {
//         id: 0
//     },
//     title: 'Your Name'
// }