import React, { Component } from 'react';
import { render } from 'react-dom';
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
        this.submitForm = this.submitForm.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.filterPages = this.filterPages.bind(this);
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
            formType: 'update'
        };
    }

    openModal(type, props) {
        this.type = type;
        this.setState({
            pageInfo: props,
            formType: type
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
            console.log('update page basics server response', response);
            if(response.success) {
                this.serverSuccess();
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
            .done(data => {
                this.serverSuccess();
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
            if(response.success) {
                this.serverSuccess(response.msg);
            } else {
                this.serverError(response.msg);
            }
        })
        .fail(error => {
           this.serverError(error.msg);
        })
        .always(() => this.hideDeleteConfirm());
    }

    serverSuccess(msg) {
        this.refreshPageList();
        this.closeModal();
    }
    serverError(msg) {
        console.log('server error:', msg);
        //eventually, notifyr on both
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
                <Modal type={this.type} data={this.state.pageInfo} closeModal={this.closeModal} showDeleteConfirm={this.showDeleteConfirm} hideDeleteConfirm={this.hideDeleteConfirm} handleChange={this.handleChange} submitForm={this.submitForm} addItem={this.addItem} updateItem={this.updateItem} deleteItem={this.deleteItem} pageAdmins={this.pageAdmins} userGroups={this.userGroups}  />
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