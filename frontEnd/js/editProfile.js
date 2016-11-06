(function () {
    "use strict";
    var student = {}
    var apiUrl = "http://localhost:3000/students/";

    // Fields for Student
    var formFields = [
        { name: "firstName", des: "First Name ", type: "text", required: true },
        { name: "lastName", des: "Last Name ", type: "text", required: true },
        { name: "major", des: "Major", type: "text", required: false },
        { name: "coverImage", des: "Profile Picture URL", type: "text", required: false },
        { name: "password", des: "Password", type: "password", required: true },
        { name: "passwordConfirm", des: "Password Confirm", type: "password", required: true },
    ]

    // Update student
    function inputHandler(property, value) {
        student[property] = value;
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
                .attr("value", student[formField.name] || "" );
            if (formField.name === "password") {
                inputElement.attr("value", "");
            }
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
    }

    // make ajax call to update student in db
    function updateUser() {
        if (student["password"] === student["passwordConfirm"]) {
            console.log(student);  
            $.ajax({
                url: apiUrl + student._id,
                type: 'PUT',
                dataType: 'JSON',
                data: student,
                success: function (data) {
                    if (data) {
                        window.location = "personal_profile.html";
                    } else {
                        console.log('User could not be retrived.');
                    }
                },
                error: function (request, status, error) {
                    console.log('Failed to update student');
                    console.log(error, status, request);
                }
            });
            return;
        } else {
            console.log("Passwords dont match");
            return;
        }
    }

    function checkIfUserLoggedIn() {
        var userString, loggedIn = true;
        try {
            userString = sessionStorage.getItem("currentUser");
        } catch (e) {
            alert("Error when reading from Session Storage " + e);
            error = true;
            window.location = "index.html";
        }
        if (loggedIn) {
            student._id = userString;
            if (student._id === null){
                window.location = "index.html"
            } else {
                getUserById();
            }
        }
    }

    function getUserById() {
        $.ajax({
            url: apiUrl + student._id,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    student = data;
                    student.password = ""
                    student.passwordConfirm = ""
                    if (student.coverImage !== undefined && student.coverImage !== ""){
                        $('#user-icon').html(' ').append($('<img src=' + student.coverImage + ' alt="User Profile Image">'))
                    } else {
                        $('#user-icon').html(' ').append($('<img src=../images/RoseSeal.png>'))
                    }
                    $('#user-email').text(student.email)
                    createForm();
                } else {
                    console.log("User not Found");
                    window.location = "index.html"
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    $(document).ready(function () {
        checkIfUserLoggedIn();
        $('#cancel-button').click(function (e) {
            e.preventDefault();
            window.location = "./personal_profile.html"
        });
        $('#save-button').click(function (e) {
            e.preventDefault();
            updateUser();
        });
    });
})();