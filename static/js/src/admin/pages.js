import React from 'react';
import { render } from 'react-dom';
import { utilities } from './utilities';
import PageList from './page-list';
import $ from 'jquery';

window.addEventListener('DOMContentLoaded', function() {
    //utilities.slideout();
    //utilities.setMenuOffset();
    $.get(window.location.pathname + '/pages-list')
        .done(data => {
            const el = document.getElementById('page-list');
            if(data.errorMsg) { return `Error getting page list: ${data.errorMsg}`; }
            render(<PageList pages={data.pageList} pageAdmins={data.pageAdmins} userGroups={data.userGroups} />, el);
        })
        .fail(error => {
            console.log('xhr request failed:', error);
        })
        .always(() => {
            utilities.hideLoader();
        });    
});