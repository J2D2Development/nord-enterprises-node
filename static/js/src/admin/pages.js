import React from 'react';
import { render } from 'react-dom';
import { utilities } from './utilities';
import { modal } from './modal';
import { PageListCard } from './page-list-card';
import $ from 'jquery';

window.addEventListener('DOMContentLoaded', function() {
    utilities.slideout();
    utilities.setMenuOffset();
    modal({ title: 'Edit basic page info', targetType: 'page' });


    //testing react- get pages list, then populate 'cards'
    $.get(window.location.pathname + '/pages-list')
        .done(data => {
            console.log('got pages list?', data);
            if(data.errorMsg) {
                return `Error getting menu items: ${data.err}`;
            }
            render(<h1>List goes here</h1>, document.getElementById('pages-list'));
        })
        .fail(error => {
            console.log('xhr request failed:', error);
        })
        .always(() => {});

    function openModal(props) {
        console.log('open that modal:', props);
    }

    //after everything is loaded, hide loader screen
    utilities.hideLoader();

    const modalElement = $('#nord-modal');
    const bg2 = document.querySelector('#bg-screen');

    //modal delete button elements
    const deleteButton = $('#confirm-delete');
    const cancelButton = $('#cancel-delete');
    const modalConfirm = document.querySelector('#modal-confirm');

    const pageEditForm = $('#modal-edit-form');
    let formType = 'update';

    //menu item edit functionality
    $('body').on('click', '.open-modal', function() {
        //get the data-attr info from the button element clicked to open this modal
        const itemData = $(this).data();
        console.log('open modal, title:', itemData);
        //check button id- if exists, we are adding a new menu item, if not, updating existing
        const addnew = $(this).prop('id');
        formType = addnew ? 'addnew' : 'update';
        
        //set the basic form fields
        //$('#title').val(itemData.title);
        // $('#help_text').val(itemData.helptext);
        // $('input[name=action][value='+itemData.action+']').prop('checked', 'checked');

        //add delete button handler
        $('#confirm-delete').on('click', () => {
            console.log('adding handler:', itemData.order);
            console.log('deleting item:', itemData.order);
        });

        $('#item-delete').on('click', () => {
            modalConfirm.classList.add('slide-down');
        });

        deleteButton.on('click', () => {
            deleteItem(`${window.location.pathname}/pages/${itemData.order}`);
        });

        //cancel deletion- hide confirm div
        cancelButton.on('click', () => {
            modalConfirm.classList.remove('slide-down');
        });

        //open the modal
        modalElement.addClass('modal-show');
        bg2.classList.add('bg-show');
    });

    function deleteItem(url) {
        console.log('sending for delete:', url);
    }

    const closeModalButtons = document.querySelectorAll("[data-dismiss='modal']");
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal, false);
    });

    function closeModal() {
        modalElement.removeClass('modal-show');
        bg2.classList.remove('bg-show');
        $('#modal-edit-form')[0].reset();
        modalConfirm.classList.remove('slide-down');
        [$('#item-delete'), deleteButton, cancelButton].forEach(ele => {
            ele.off('click');
        });
        //$('#page-delete').off('click');
    }

    pageEditForm.on('submit', function(evt) {
        evt.preventDefault();

        const dataObj = pageEditForm.serializeArray()
            .reduce(function(total, item) {
                total[item.name] = item.value;
                return total;
            }, {});

        if(formType === 'update') {
            updateItem(dataObj, `${window.location.pathname}/page/${dataObj.order}`);
        } else if(formType === 'addnew') {
            addItem(dataObj, `${window.location.pathname}/page`);
        } else {
            console.log('could not find update type');
        }
    });

    function updateItem(item, url) {
        console.log('updating existing:', item, url);
    }

    function addItem(item, url) {
        console.log('adding item:', item, url);
    }
});