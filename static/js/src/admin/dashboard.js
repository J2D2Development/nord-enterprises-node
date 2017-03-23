import $ from 'jquery';
import { utilities } from './utilities';

$(document).ready(function() {
    //init slideout menu
    utilities.slideout();
    //init static menu offset (move content down height of top menu)
    utilities.setMenuOffset();

    //everything initialized, hide loader
    utilities.hideLoader();
});