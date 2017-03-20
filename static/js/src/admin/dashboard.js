import $ from 'jquery';
import { slideout } from './menu-slideout';
import { setMenuOffset } from './menu-offset';

$(document).ready(function() {
    //if you add a 'loading' animation for overall loading, hide here
    slideout();
    setMenuOffset();
});