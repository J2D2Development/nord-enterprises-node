export const slideout = () => {
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
};