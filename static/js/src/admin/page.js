import VerticalMenu from './vertical-menu';

const menu = document.querySelector('#graphical-menu');
const menuContentsArray = new VerticalMenu();
menu.innerHTML = menuContentsArray.returnMenu().join('');