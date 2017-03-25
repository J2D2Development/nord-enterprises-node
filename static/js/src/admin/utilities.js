import $ from 'jquery';

export const utilities = {
    hideLoader: () => {
        const fullscreenLoader = document.querySelector('#fullscreen-loader');
        fullscreenLoader.classList.add('slide-up-out');
    },
    setMenuOffset: () => {
        const topMenu = document.querySelector('#top-menu');
        const adminMain = document.querySelector('.admin-main');
        adminMain.style.paddingTop = `${topMenu.clientHeight + 16}px`;

        $(window).resize(function() {
            adminMain.style.paddingTop = `${topMenu.clientHeight + 16}px`;
        });
    },
    slideout: () => {
        const openMenuButton = document.querySelector('#open-menu');
        const closeMenuButton = document.querySelector('#close-menu');
        const menu = document.querySelector('#main-menu');
        const bg = document.querySelector('#bg-screen');

        openMenuButton.addEventListener('click', function() {
            menu.classList.add('slideout-right--show');
            bg.classList.add('bg-show');
            closeMenuButton.classList.add('menu-open');
        });

        [closeMenuButton, bg].forEach(function(element) {
            element.addEventListener('click', function() {
                menu.classList.remove('slideout-right--show');
                bg.classList.remove('bg-show');
                closeMenuButton.classList.remove('menu-open');
            });
        });
    }
};