import React, { Component } from 'react';
import PageListCard from './page-list-card';
import $ from 'jquery';

export default class PageList extends Component {
    constructor(props) {
        super(props);
        this.pages = props.pages
    }

    openModal(props) {
        console.log('open that modal:', props);
    }

    render() {
        return(
            <div>
                {this.pages.map(page => {
                    return <PageListCard key = {page.page_id} openModal = {this.openModal} data = {page} />;
                })}
            </div>
        );
    }
}