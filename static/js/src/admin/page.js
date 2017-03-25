import { VerticalMenuItem, AddNewVerticalMenuItem } from './menu-items';
import { PageArea, AddNewPageArea } from './page-areas';
import { utilities } from './utilities';
import { notifyr } from './notifyr';
//import { modal } from './modal';
import $ from 'jquery';

//$(document).ready(function() {
window.addEventListener('DOMContentLoaded', function() {
    console.log('dom content loaded');
    //run initializations
    utilities.slideout(); //slideout menu
    utilities.setMenuOffset(); //get top menu height, move content down (for static header)
    
    //modal({title: 'Edit this page'});

    //page jump drop down list
    const bg2 = document.querySelector('#bg-screen');
    const switchPageSelect = document.querySelector('#switch-page');
    switchPageSelect.addEventListener('change', function(evt) {
        var pathArr = window.location.pathname.split('/');
        pathArr[4] = evt.target.value;
        var newPath = window.location.origin + pathArr.join('/');
        window.location = newPath;
    });

    const menu = document.querySelector('#menu-wrapper');
    const pageAreas = document.querySelector('#page-areas');
    

    //modal elements
    const modalElement = $('#menuItemModal');
    //modal delete button elements
    const deleteButton = $('#confirm-delete');
    const cancelButton = $('#cancel-delete');
    const modalConfirm = document.querySelector('#modal-confirm');

    const getMenuItems = () => {
        $.get(window.location.pathname + '/menuitems')
            .done(data => {
                if(data.errorMsg) {
                    return `Error getting menu items: ${data.err}`;
                }
                const existingItems = data.map(item => {
                    return VerticalMenuItem(item);
                })
                existingItems.push(AddNewVerticalMenuItem(data[0]['menu_style']));
                
                menu.innerHTML = existingItems.join('');
            })
            .fail(error => {
                console.log('xhr request failed:', error);
            })
            .always(() => {});
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
            .always(() => {});
    };
    getPageAreas();

    //everything initialized, hide loader
    utilities.hideLoader();

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
            console.log('update menu item server response', response);
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

    function deleteMenuItem(url) {
        $.ajax({
            url: url,
            type: 'DELETE',
            dataType: 'json',
            beforeSend: () => {}
        })
        .done(response => {
            if(response.success) {
                menuItemUpdateSuccess(response.msg);
            } else {
                menuItemUpdateError(response.msg);
                
            }
        })
        .fail(error => {
            menuItemUpdateError(error.msg);
        })
        .always(() => {
            modalConfirm.classList.remove('slide-down');
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




    
    //store full list so we can reset
    // const specificItemList = document.querySelector('#action_item');
    // const fullFeatureItemOptions = specificItemList.options; 
    // console.log('on load, full specific feature item list:', fullFeatureItemOptions);
    const originalSpecificItemList = $('#action_item option');
    function filterSpecificFeatureList(featureId) {
        //check if specific feature item
        console.log('search for id:', featureId);
        $('#action_item').html($.map($('#action_item option'), option => {
            if($(option).data().parentfeature === featureId) {
                console.log('found match:', option);
                return option;
            }
        }));
    }
    function resetSpecificFeatureList() {
        console.log('reset all to:', originalSpecificItemList);
        $('#action_item').html($.map(originalSpecificItemList, option => {
            return option;
        }));
    }

    

    //menu item edit functionality
    $('body').on('click', '.openMenuItemModal', function() {
        //get the data-attr info from the button element clicked to open this modal
        const itemData = $(this).data();
        //check button id- if exists, we are adding a new menu item, if not, updating existing
        const addnew = $(this).prop('id');

        //couple globals to track modal type and order (for use in update);
        menuItemFormType = addnew ? 'addnew' : 'update';
        menuItemOrder = +itemData.order || 0;

        if(menuItemFormType === 'addnew') {
            $('#modal-title').html('Add Menu Item');
            $('#menuitem-delete').hide();
        } else {
            $('#modal-title').html('Edit Menu Item');
            $('#menuitem-delete').show();
        }
        
        //set the basic form fields
        $('#title').val(itemData.title);
        $('#help_text').val(itemData.helptext);
        $('input[name=action][value='+itemData.action+']').prop('checked', 'checked');


        
        //check item type- set appropriate fields
        if(itemData.action === 'p') {
            $('#page_action_id').val(itemData.actionid);
        } else if(itemData.action === 'f') {
            $('#feature_action_id').val(itemData.actionid);
            //add set for specific item id- if enabled
            if(itemData.actionitem) {
                //filter the item list- only show items for the parent feature
                filterSpecificFeatureList(+$('#feature_action_id').val());
                //check the 'specific item' box
                $('input[name=choose_feature_item]').prop('checked', 'checked');
                //set the drop down to correct feature item
                $('#action_item').val(itemData.actionitem);
                //show 2nd drop down
                $('#select_feature_item').addClass('opacity-full');
            }
        } else {
            $('#action_url').val(itemData.actionurl);
        }

        $('#choose_feature_item').on('change', () => {
            if($("#choose_feature_item").is(':checked')) {
                console.log($('#feature_action_id').val());
                filterSpecificFeatureList(+$('#feature_action_id').val());
                $('#select_feature_item').addClass('opacity-full');
            } else {
                $('#select_feature_item').removeClass('opacity-full');
                resetSpecificFeatureList();
            }
        });

        $('#feature_action_id').on('change', evt => {
            filterSpecificFeatureList(+evt.target.value);
        });

        //show the proper edit fields for this type (feature vs page vs external)
        adjustForMenuItemType(itemData.action);

        //add delete button handler- just show confirmation notice
        $('#menuitem-delete').on('click', () => {
            modalConfirm.classList.add('slide-down');
        });

        //but first show confirm message
        deleteButton.on('click', () => {
            deleteMenuItem(`${window.location.pathname}/menuitems/${itemData.order}`);
        });

        //cancel deletion- hide confirm div
        cancelButton.on('click', () => {
            modalConfirm.classList.remove('slide-down');
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
        resetSpecificFeatureList();
        $('#select_feature_item').removeClass('opacity-full');
        modalConfirm.classList.remove('slide-down');
        [$('#menuitem-delete'), deleteButton, cancelButton].forEach(ele => {
            ele.off('click');
        });
        $('#choose_feature_item').off('change');
        $('#feature_action_id').off('change');
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
});