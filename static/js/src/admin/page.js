import { GraphicalMenuItem, AddNewGraphicalMenuItem } from './graphical-menu-item';
import $ from "jquery";

const menu = document.querySelector('#graphical-menu');

$.get(window.location.pathname + '/menuitems')
    .done(data => {
        if(data.errorMsg) {
            return `Error getting menu items: ${data.err}`;
        }
        const existingItems = data.map(item => {
            return GraphicalMenuItem(item);
        })
        existingItems.push(AddNewGraphicalMenuItem())
        
        menu.innerHTML = existingItems.join('');
    })
    .fail(error => {
        console.log('xhr request failed:', error);
    })
    .always(() => {
        console.log('always block!');
    });