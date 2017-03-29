import React from 'react';
import { render } from 'react-dom';
import { utilities } from './utilities';
import PageList from './page-list';
import $ from 'jquery';

window.addEventListener('DOMContentLoaded', function() {
    utilities.slideout();
    utilities.setMenuOffset();

    $.get(window.location.pathname + '/pages-list')
        .done(data => {
            if(data.errorMsg) {
                return `Error getting page list: ${data.err}`;
            }
            render(<PageList pages={data.pageList} pageAdmins={data.pageAdmins} userGroups={['admins', 'board', 'normies']} />, document.getElementById('page-list'));
        })
        .fail(error => {
            console.log('xhr request failed:', error);
        })
        .always(() => {});

    //after everything is loaded, hide loader screen
    utilities.hideLoader();
});