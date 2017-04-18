import React from 'react';
import { render } from 'react-dom';
import $ from 'jquery';
import { utilities } from './utilities';
import Dashboard from './dashboard/dashboard-list';

$(document).ready(function() {
    const el = document.getElementById('admin');
    render(<Dashboard />, el);

    //everything initialized, hide loader
    utilities.hideLoader();
});