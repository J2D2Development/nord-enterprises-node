export const notifyr = (config) => {
    const wrapper = document.querySelector('#notifyr');
    const time = config.duration || 3000;
    const delay = 500; //from css transition timing

    wrapper.innerHTML = config.msg || 'Status Message!';
    wrapper.classList.add(config.type);
    wrapper.classList.add('notifyr-show');

    setTimeout(() => {
        wrapper.classList.remove('notifyr-show');
    }, time);

    setTimeout(() => {
        wrapper.classList.remove(config.type);
        wrapper.innerHTML = '';
    }, time + delay);
};