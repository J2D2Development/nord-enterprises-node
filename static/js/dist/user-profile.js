$(document).ready(function() {
    var slider = document.querySelector('.sidebar');
    var sliderBackdrop = document.querySelector('#slider-backdrop');
    var showButton = document.querySelector('#slider-show');
    var hideButton = document.querySelector('#slider-hide');
    var loadingProfileScreen = document.querySelector('#loading-profile');
    var profileUpdateForm = document.querySelector('#profile-update');
    var saveButton = document.querySelector('#profile-save');
    var cancelButton = document.querySelector('#profile-cancel');
    var logOutButton = document.querySelector('#profile-logout');
    var errorFirstName = document.querySelector('#slider-error-firstName');
    var errorLastName = document.querySelector('#slider-error-lastName');
    var errorEmail = document.querySelector('#slider-error-email');
    var headerUserName = document.querySelector('#header-user-name');
    var loggedInUserInfo = document.querySelector('#logged-in-user-info');
    var email = document.querySelector('#email');
    var firstName = document.querySelector('#first-name');
    var lastName = document.querySelector('#last-name');
    var phone = document.querySelector('#phone');
    var submitted = false;

    //check validation as you type/switch fields for names and email
    ['keyup', 'blur'].forEach(function(evt) {
        email.addEventListener(evt, checkEmailValidation, false);
        firstName.addEventListener(evt, checkValidation, false);
        lastName.addEventListener(evt, checkValidation, false);
    });

    function hideLoader() {
        loadingProfileScreen.classList.remove('loading-profile-show');
        setTimeout(function() {
            loadingProfileScreen.classList.remove('loading-profile-front');
        }, 400);
    }

    function showLoader() {
        loadingProfileScreen.classList.add('loading-profile-front');
        setTimeout(function() {
            loadingProfileScreen.classList.add('loading-profile-show');
        }, 400);
    }

    function checkValidation() {
        if(submitted) {
            //if value becomes valid, remove error notice
            if(this.value != '' && this.classList.contains('invalid-field')) {
                document.querySelector('#'+this.dataset.error).classList.add('error-hidden');
            }
        }

        this.value == '' ? this.classList.add('invalid-field') : this.classList.remove('invalid-field');
    }

    function checkEmailValidation() {
        //email can be blank, but if it's not, needs to be validated
        var valid = this.value !== '' && /^.+@.+\..+$/.test(this.value);

        if(submitted) {
            if((valid || this.value == '') && this.classList.contains('invalid-field')) {
                document.querySelector('#'+this.dataset.error).classList.add('error-hidden');
            }
        }

        if(!valid && this.value !== '') {
            if(!this.classList.contains('invalid-field')) {
                this.classList.add('invalid-field');
            }
        } else {
            if(this.classList.contains('invalid-field')) {
                this.classList.remove('invalid-field');
            }
        }
    }

    function clearPreviousValidations(field) {
        //remove red outline from actual field
        if(field.classList.contains('invalid-field')) {
            field.classList.remove('invalid-field');
        }

        //remove any showing error messages
        if(field.dataset.error) {
            document.querySelector('#'+field.dataset.error).classList.add('error-hidden');
        }
    }

    function addError(ele) {
        ele.classList.remove('error-hidden');
    }

    function updateProfileNameDisplay(elements, firstName) {
        elements.forEach(function(element) {
            element.innerText = firstName;
        });
    }

    saveButton.addEventListener('click', function(e) {
        e.preventDefault();
        submitted = true;
        var emailPresentAndValid = true;

        var data = {
            firstName: htmlEntities(firstName.value),
            lastName: htmlEntities(lastName.value),
            email: htmlEntities(email.value),
            phone: htmlEntities(phone.value)
        };

        if(data.firstName == '') {
            addError(errorFirstName);
        }
        if(data.lastName == '') {
            addError(errorLastName);
        }
        if(data.email != '' && !/^.+@.+\..+$/.test(data.email)) {
            addError(errorEmail);
            emailPresentAndValid = false;
        }

        if(data.firstName != '' && data.lastName != '' && emailPresentAndValid) {
            $.ajax({
                type: 'POST',
                cache: false,
                url: 'processors/user_profile_save.php',
                data: data
            })
            .done(function(result) {
                showUpdateResults(result);
                updateProfileNameDisplay([loggedInUserInfo, headerUserName], firstName.value);
                submitted = false;
            })
            .fail(function(error) {
                console.log('Processor failed:', error);
            });
        }
    });

    showButton.addEventListener('click', function() {
      slider.classList.add('sidebar-show');
      sliderBackdrop.classList.add('backdrop-show');

      //fire initial user data 'get' request
      getUserData();
    });

    logOutButton.addEventListener('click', function() {
        window.location.assign('feature.html?feature_id=0&f=logout&t=us');
    });

    hideButton.addEventListener('click', closeSlider);
    cancelButton.addEventListener('click', closeSlider);
    sliderBackdrop.addEventListener('click', closeSlider);

    //helper to get user data (on initial load and after updates made)
    function getUserData() {
        $.ajax({
            type: 'POST',
            cache: false,
            url: 'processors/user_profile_get.php'
        })
        .done(function(response) {
            var parsedResponse = JSON.parse(response);
            firstName.value = parsedResponse.firstName;
            lastName.value = parsedResponse.lastName;
            email.value = parsedResponse.email;
            phone.value = parsedResponse.phone;
            updateProfileNameDisplay([headerUserName], parsedResponse.firstName);
            var timer = setTimeout(hideLoader, 250);
        })
        .fail(function(response) {
            console.log('request failed:', response);
            hideLoader();
        });
    }

    function closeSlider() {
      //hide slider
      slider.classList.remove('sidebar-show');
      sliderBackdrop.classList.remove('backdrop-show');

      //clear errors
      clearPreviousValidations(email);
      clearPreviousValidations(firstName);
      clearPreviousValidations(lastName);

      //hide status divs, show form for next opening
      setTimeout(function() {
          profileUpdateForm.reset();
          $('#modal-main-info').show();
          $('#modal-messages').hide();
          $('#modal-message-title').html('')
          $('#modal-message-text').html('');
          showLoader();
        }, 600);

      return false;
    }

    //helper to show results- mess of jquery for now, but will refactor soon
    function showUpdateResults(result) {
        var myResult = JSON.parse(result);
        var messageTitle = myResult.success === 1 ? 'Save Successful!' : 'Error in Saving';
        $('#modal-message-title').html(messageTitle)
        $('#modal-message-text').html(myResult.msg);
        $('#modal-main-info').fadeOut(500, function() {
            $('#modal-messages').fadeIn(500, function() {
                if(myResult.success === 1) {
                    $('#modal-success').fadeIn(500, function() {
                        setTimeout(function() {
                            $('#modal-message-text').fadeIn(500, function() {
                                setTimeout(function() {
                                    closeSlider();
                                }, 1500);
                            });
                        }, 500);
                    });
                } else {
                    $('#modal-failure').fadeIn(500, function() {
                        setTimeout(function() {
                            $('#modal-message-text').fadeIn(500);
                        }, 500);
                    });
                }
            });
        });
    }

    //initial strip of brackets to avoid harmful chars (more sanitization on backend);
    function htmlEntities(str) {
        return String(str)
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
});