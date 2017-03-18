import $ from 'jquery';

export const setMenuOffset = () => {
    $(document).ready(function() {
        const topMenu = document.querySelector('#top-menu');
        const adminMain = document.querySelector('.admin-main');
        adminMain.style.paddingTop = `${topMenu.clientHeight + 16}px`;
    });
};