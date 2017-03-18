import { GraphicalMenuItem, AddNewGraphicalMenuItem } from './graphical-menu-item';
import { PageArea, AddNewPageArea } from './page-areas';
import { slideout } from './menu-slideout';
import { notifyr } from './notifyr';
import { setMenuOffset } from './menu-offset';
import $ from 'jquery';

$(document).ready(function() {
    slideout();
    setMenuOffset();
    const menu = document.querySelector('#graphical-menu');
    const pageAreas = document.querySelector('#page-areas');

    const getMenuItems = () => {
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
    };
    getMenuItems();

    const getPageAreas = () => {
        $.get(window.location.pathname + '/pageareas')
            .done(data => {
                if(data.errorMsg) {
                    return `Error getting page areas: ${data.err}`;
                }
                const existingAreas = data.map(item => {
                    return PageArea(item);
                })
                existingAreas.push(AddNewPageArea())
                
                pageAreas.innerHTML = existingAreas.join('');
            })
            .fail(error => {
                console.log('xhr request failed:', error);
            })
            .always(() => {
                console.log('always block!');
            });
    };
    getPageAreas();

    //track type of menu item (p, f, x)
    let menuItemType = '';
    //track form type (addnew or update)
    let menuItemFormType = 'update';
    //track order for update calls
    let menuItemOrder = 0;

    const menuItemForm = $('#menu-item-edit-form');

    //form submit handler
    menuItemForm.on('submit', function(evt) {
        evt.preventDefault();

        //format data
        var dataArr = menuItemForm.serializeArray();
        var dataObj = dataArr.map(item => {
            if(menuItemType === 'p') {
                if(item.name === 'page_action_id') { item.value = +item.value }
            } else if (menuItemType === 'f') {
                if(item.name === 'feature_action_id') { item.value = +item.value }
            }
            
            if(item.name === 'action_item' && item.value === '') {
                item.value = 0;
            } else if(item.name === 'action_item') {
                item.value = +item.value;
            }

            return item;
        })
        .filter(item => {
            if(menuItemType === 'p') {
                return item.name !== 'feature_action_id' && item.name !== 'action_url';
            } else if (menuItemType === 'f') {
                return item.name !== 'page_action_id' && item.name !== 'action_url';
            } else {
                return item.name !== 'feature_action_id' && item.name !== 'action_item' && item.name !== 'page_action_id';
            }
        })
        .reduce(function(total, item) {
            total[item.name] = item.value;
            return total;
        }, {});

        if(menuItemOrder !== 0) {
            dataObj.order = menuItemOrder;
        }

        //check form- set api url (for new item vs update item)
        if(menuItemFormType === 'update') {
            updateMenuItem(`${window.location.pathname}/menuitems/${dataObj.order}`, dataObj);
        } else if(menuItemFormType === 'addnew') {
            addMenuItem(`${window.location.pathname}/menuitems`, dataObj);
        } else {
            console.log('could not find update type');
        }
    });

    function addMenuItem(url, data) {
        //!!!add validation (no empty title field- others?)
        $.post(url, data)
            .done(response => {
                //!!!show notifyr, close modal, fire 'get' call
                console.log('returned info to client:', response); //success, msg, next
                if(response.success) {
                    menuItemUpdateSuccess(response.msg);
                } else {
                    menuItemUpdateError(response.msg);
                }
            })
            .fail(error => {
                //!!!show notifyr error
                console.log('returned but with error:', error);
                menuItemUpdateError(error.msg);
            });
    }

    function updateMenuItem(url, data) {
        $.ajax({
            url: url,
            type: 'PUT',
            dataType: 'json',
            beforeSend: () => {
                console.log('before send fired');
            },
            data: data
        })
        .done(response => {
            console.log('update menu item server response');
            if(response.success) {
                menuItemUpdateSuccess(response.msg);
            } else {
                menuItemUpdateError(response.msg);
            }
        })
        .fail(error => {
            console.log('returned but with error:', error);
            menuItemUpdateError(error.msg);
        });
    }

    function menuItemUpdateSuccess(msg) {
        notifyr({ msg, type: 'notifyr-success', duration: 3000 });
        closeModal();
        getMenuItems();
    }

    function menuItemUpdateError(msg) {
        notifyr({ msg, type: 'notifyr-error', duration: 3000 });
    }

    const bg2 = document.querySelector('#bg-screen');
    const switchPageSelect = document.querySelector('#switch-page');

    switchPageSelect.addEventListener('change', function(evt) {
        var pathArr = window.location.pathname.split('/');
        pathArr[4] = evt.target.value;
        var newPath = window.location.origin + pathArr.join('/');
        window.location = newPath;
    });

    const modalElement = $('#menuItemModal');

    //menu item edit functionality
    $('body').on('click', '.openMenuItemModal', function() {
        //get the data-attr info from the button element clicked to open this modal
        const itemData = $(this).data();
        //check button id- if exists, we are adding a new menu item, if not, updating existing
        const addnew = $(this).prop('id');

        //couple globals to track modal type and order (for use in update);
        menuItemFormType = addnew ? 'addnew' : 'update';
        menuItemOrder = +itemData.order || 0;
        
        //set the basic form fields
        $('#title').val(itemData.title);
        $('#help_text').val(itemData.helptext);
        $('input[name=action][value='+itemData.action+']').prop('checked', 'checked');
        
        //check item type- set appropriate fields
        if(itemData.action === 'p') {
            $('#page_action_id').val(itemData.actionid);
        } else if(itemData.action === 'f') {
            $('#feature_action_id').val(itemData.actionid);
            //add set for specific item id
        } else {
            $('#action_url').val(itemData.actionurl);
        }

        //show the proper edit fields for this type (feature vs page vs external)
        adjustForMenuItemType(itemData.action);

        //add delete button handler
        $('#menuitem-delete').on('click', () => {
            console.log('adding handler:', itemData.order);
            console.log('deleting item:', itemData.order);
        });

        //open the modal
        modalElement.addClass('modal-show');
        bg2.classList.add('bg-show');
    });

    $('input[name=action]').on('change', function(evt) {
        adjustForMenuItemType(evt.target.value);
    });

    const closeModalButtons = document.querySelectorAll("[data-dismiss='modal']");
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal, false);
    });
    function closeModal() {
        modalElement.removeClass('modal-show');
        bg2.classList.remove('bg-show');
        $('#menu-item-edit-form')[0].reset();
        $('#menuitem-delete').off('click');
    }

    function adjustForMenuItemType(type) {
        if(type === 'p') {
            $('#button-feature').hide();
            $('#button-external').hide();
            $('#button-page').show();
            menuItemType = 'p';
        } else if(type === 'f') {
            $('#button-page').hide();
            $('#button-external').hide();
            $('#button-feature').show();
            menuItemType = 'f';
        } else {
            $('#button-page').hide();
            $('#button-feature').hide();
            $('#button-external').show();
            menuItemType = 'x';
        }
    }

    //sidebar accordion?
    // var accButtons = document.querySelectorAll('.slideout-options__button');
    // accButtons.forEach(function(button) {
    //     var _this = this;
    //     button.addEventListener('click', function() {
    //         var myContentDiv = document.querySelector('#'+this.id+'content');
    //         var allContentDivs = document.querySelectorAll('.slideout-options__content');
    //         console.log(myContentDiv);
    //         console.log(allContentDivs);
    //         //slideout-options__content - class

    //     }, false);
    // });
});