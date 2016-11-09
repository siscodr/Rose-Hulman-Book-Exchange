(function () {
    "use strict";
    var apiUrl = "https://rose-hulman-textbook-exchange.herokuapp.com/students/";
    var user;
    var editForm = false;
    // FormsFields will be used when creating the forms
    var formFields = [
        { name: "firstName", des: "First Name ", type: "text", required: true },
        { name: "lastName", des: "Last Name ", type: "text", required: true },
        { name: "email", des: "Email", type: "email", required: true },
        { name: "major", des: "Major", type: "text", required: false },
        { name: "coverImage", des: "Profile Picture URL", type: "text", required: false },
        { name: "password", des: "Password", type: "password", required: true },
        { name: "passwordConfirm", des: "Password Confirm", type: "password", required: true },
    ];

    // Update user
    function inputHandler(property, value) {
        user[property] = value;
    }

    // Add create new User button
    function addNewButton(formElement) {
        formElement.append('<button type="submit" id="new-user-button"> Create New Profile </button>');
        $('#new-user-button').click(function (e) {
            e.preventDefault(); // Prevent querystring from showing up in address bar
            createUser();
        });
    }

    // populate the user form with the necessary fields
    function createForm() {
        var formElement = $("[name='userForm']").empty();
        // Add form elements and their event listeners
        formFields.forEach(function (formField) {
            var labelElement = $("<label>")
                .attr("for", formField.name)
                .text(formField.des);
            formElement.append(labelElement);
            var inputElement = $("<input>")
                .attr("type", formField.type)
                .attr("name", formField.name)
                .attr("value", (user[formField.name] || ""));
            if (formField.required) {
                inputElement.prop("required", true).attr("aria-required", "true");
            }
            formElement.append(inputElement);
            inputElement.on('input', function () {
                var thisField = $(this);
                inputHandler(formField.name, thisField.val());
            });
            // clear the horizontal and vertical space next to the 
            // previous element
            formElement.append('<div style="clear:both"></div>');
        });
        addNewButton(formElement);
    }

    // make ajax call to add new contact to db
    function createUser() {
        if (user["password"] === user["passwordConfirm"]) {
            console.log(user);  
            $.ajax({
                url: apiUrl,
                type: 'POST',
                dataType: 'JSON',
                data: user,
                success: function (data) {
                    if (data) {
                        sessionStorage.setItem("currentUser", data._id);
                        window.location = "home_page.html";
                    } else {
                        console.log('User could not be retrived.');
                    }
                },
                error: function (request, status, error) {
                    console.log('Failed to make user');
                    console.log(error, status, request);
                }
            });
            return;
        } else {
            console.log("Passwords dont match");
            return;
        }
    }

    $(document).ready(function () {
        user = {};
        createForm();
    });

})();