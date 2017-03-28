import React, { Component } from 'react';
import { render } from 'react-dom';
import PageListCard from './page-list-card';
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
        this.state = {
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

    render() {
        return(
            <div>
                {this.pages.map(page => {
                    return <PageListCard key={page.page_id} openModal={this.openModal} data={page} />;
                })}
                <Modal data = {this.state.pageInfo} closeModal={this.closeModal} showDeleteConfirm={this.showDeleteConfirm} hideDeleteConfirm={this.hideDeleteConfirm} handleChange={this.handleChange} submitForm={this.submitForm} addItem={this.addItem} updateItem={this.updateItem} deleteItem={this.deleteItem} pageAdmins={this.pageAdmins} userGroups={this.userGroups}  />
            </div>
        );
    }
}