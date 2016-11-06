(function () {
    "use strict";
    var student = {}, review;
    var apiUrl = "http://localhost:3000/students/";

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
                loggedIn = false;
                loadLogin();
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
                    displayUser();
                } else {
                    console.log("User not Found");
                    sessionStorage.clear("currentUser");
                    loadLogin();
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
                sessionStorage.clear("currentUser");
                loadLogin();
            }
        });
    }
    function loadLogin(){
        var container = $('#right')
        container.append($('<h2>').text('Sign In'))
        var theDiv = $("<div id='login'>")
        var loginForm = $('<form>')
        loginForm.append($('<p>').append($('<input id="usernameField" type="text" placeholder="Username or Email">')))
        loginForm.append($('<p>').append($('<input id="passwordField" type="password" placeholder="Password">')))
        loginForm.append($('<br />'))
        loginForm.append($('<input type="submit" id="login-button" value="Submit">'))
        theDiv.append(loginForm)
        theDiv.append($('<br />'))
        theDiv.append($('<a href="./registration.html">Register Account</a>'))
        container.append(theDiv)
        $('#login-button').click(function (e) {
            e.preventDefault(); // Prevent querystring from showing up in address bar
            loginUser();
        });
    }

    function displayUser(){
        var container = $('#right').html('');
        container.append($('<h2>').text("Welcome " + student.lastName))
        var listOfLinks = $('<ul>')
        listOfLinks.append($('<li>').append($('<a href="./personal_profile.html">My Profile</a>')))
        listOfLinks.append($('<li>').append($('<a href="./search.html">Search Listings</a>')))
        listOfLinks.append($('<li>').append($('<a id="logout">Logout</a>')))
        container.append($('<div>').attr('id', 'nav').append(listOfLinks))
        $('#logout').click(function (e) {
            e.preventDefault(); // Prevent querystring from showing up in address bar
            logoutUser();
        });
    }

    function loginUser(){
        var email = $('#usernameField').val()
        var password = $('#passwordField').val()
        var testUser = {};
        testUser["email"] = email
        testUser["password"] = password
        $.ajax({
            url: apiUrl + 'login/',
            type: 'POST',
            dataType: 'JSON',
            data: testUser,
            success: function (data) {
                if (data) {
                    student = data;
                    console.log(data);
                    sessionStorage.setItem("currentUser", student._id);
                    displayUser();
                } else {
                    console.log("User not Found");
                    loadLogin();
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    function logoutUser(){
        sessionStorage.clear("currentUser");
        window.location = './home_page.html';
    }

    $(document).ready(function () {
        checkIfUserLoggedIn();
    });
})();