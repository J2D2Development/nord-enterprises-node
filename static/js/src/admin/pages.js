import { utilities } from './utilities';
import $ from 'jquery';

$(document).ready(function() {
    utilities.slideout();
    utilities.setMenuOffset();

    //after everything is loaded, hide loader screen
    utilities.hideLoader();

    const modalElement = $('#nord-modal');
    const bg2 = document.querySelector('#bg-screen');
    const pageEditForm = $('#modal-edit-form');
    let formType = 'update';

    //menu item edit functionality
    $('body').on('click', '.open-modal', function() {
        //get the data-attr info from the button element clicked to open this modal
        const itemData = $(this).data();
        //check button id- if exists, we are adding a new menu item, if not, updating existing
        const addnew = $(this).prop('id');
        formType = addnew ? 'addnew' : 'update';
        
        //set the basic form fields
        $('#title').val(itemData.title);
        // $('#help_text').val(itemData.helptext);
        // $('input[name=action][value='+itemData.action+']').prop('checked', 'checked');

        //add delete button handler
        $('#page-delete').on('click', () => {
            console.log('adding handler:', itemData.order);
            console.log('deleting item:', itemData.order);
        });

        //open the modal
        modalElement.addClass('modal-show');
        bg2.classList.add('bg-show');
    });

    const closeModalButtons = document.querySelectorAll("[data-dismiss='modal']");
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal, false);
    });

    function closeModal() {
        modalElement.removeClass('modal-show');
        bg2.classList.remove('bg-show');
        $('#modal-edit-form')[0].reset();
        $('#page-delete').off('click');
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