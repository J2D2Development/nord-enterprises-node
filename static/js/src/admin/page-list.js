import React, { Component } from 'react';
import { render } from 'react-dom';
import PageListCard from './page-list-card';
import Search from './search';
import Modal from './modal';

export default class PageList extends Component {
    constructor(props) {
        super(props);
        this.pages = props.pages;
        this.pageAdmins = props.pageAdmins
        this.userGroups = props.userGroups;
        this.openModal = this.openModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
        this.filterPages = this.filterPages.bind(this);
        this.newPage = {
            title: 'Add New Page',
            require_auth: 'n',
            require_group_auth: 'n',
            home_page: 'n',
            admin_user: '',
            page_id: 0
        };
        
        this.state = {
            pages: this.pages,
            pageInfo: {},
            userGroups: props.userGroups,
            formType: 'update'
        };
    }

    openModal(props) {
        console.log('open modal props:', props);
        this.setState({
            pageInfo: props
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
        if(this.state.formType === 'update') {
            this.updateItem(this.state.pageInfo);
        } else {
            this.addItem(this.state.pageInfo);
        }
    }

    updateItem(item, url) {
        console.log('updating existing:', item, url);
    }

    addItem(item, url) {
        console.log('adding item:', item, url);
    }

    deleteItem(url) {
        console.log('deleting: ', url);
        this.hideDeleteConfirm();
        this.closeModal();
    }

    filterPages(evt) {
        console.log('typing in filter:', evt.target.value);
        console.log(this.state.pages);
        let pageInfoFiltered = [...this.pages].filter(page => {
            return page.title.toLowerCase().indexOf(evt.target.value.toLowerCase()) !== -1;
        });

        console.log('filtered array:', pageInfoFiltered.length);

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
                        <button type="button" className="btn btn-primary" onClick={() => this.openModal(this.newPage)}>
                            Create New Page
                        </button>
                    </div>
                </div>
                {this.state.pages.map(page => {
                    return <PageListCard key={page.page_id} openModal={this.openModal} data={page} />;
                })}
                <Modal data = {this.state.pageInfo} closeModal={this.closeModal} showDeleteConfirm={this.showDeleteConfirm} hideDeleteConfirm={this.hideDeleteConfirm} handleChange={this.handleChange} submitForm={this.submitForm} addItem={this.addItem} updateItem={this.updateItem} deleteItem={this.deleteItem} pageAdmins={this.pageAdmins} userGroups={this.userGroups}  />
            </div>
        );
    }
}