(function () {
    "use strict";
    var student = {}
    var visitingStudent = {}
    var apiUrl = "https://rose-hulman-textbook-exchange.herokuapp.com/";

    function checkIfUser() {
        var userString, loggedIn = true;
        try {
            student._id = sessionStorage.getItem("currentUser");
            userString = sessionStorage.getItem("visitingProfileEmail");
        } catch (e) {
            alert("Error when reading from Session Storage " + e);
            error = true;
            //window.location = "index.html";
        }
        if (loggedIn) {
            visitingStudent.email = userString;
            if (visitingStudent.email === null){
                window.location = "./personal_profile.html"
            } else {
                getUserById();
            }
        }
    }

    function getUserById() {
        $.ajax({
            url: apiUrl + 'students/withListings/' + visitingStudent.email + "/",
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    visitingStudent = data;
                    displayProfile();
                } else {
                    console.log("User not Found");
                    window.location = "./home_page.html"
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
                window.location = "./home_page.html"
            }
        });
    }

    function displayProfile() {
        $('#user-fullname').text('Name: ' + visitingStudent.firstName + ' ' + visitingStudent.lastName);
        $('#user-major').text('Major: ' + visitingStudent.major);
        $('#user-email').text('Email: ' + visitingStudent.email);
        if (visitingStudent.coverImage !== undefined && visitingStudent.coverImage !== "") {
            $('#user-icon').html(' ').append($('<img src=' + visitingStudent.coverImage + '>'))
        } else {
            $('#user-icon').html(' ').append($('<img src="../images/RoseSeal.png" alt="User icon"></img>'))
        }
        $('#edit').attr("hidden", false);
        loadListings();
        document.getElementById('listing').style.display = "block";    
    }

    function loadListings(){
        for(var i = 0 ; i < visitingStudent.listings.length; i++) {
            var listingContainer = $('<div class="listing" id=\"'+visitingStudent.listings[i]._id+ '\">')
            var listingObject = $('<div class="listingDiv" >')

            var topContentObject = $('<div class="topContent" >')
            var bottomContentObject = $('<div class="bottomContent" >')
            var buttonContainerObject = $('<div class="buttonContainer" >')  

            if (visitingStudent.listings[i].coverImage !== undefined) {
                topContent.append($('<div class="coverImageContainer">').append($('<img class="coverImage">').attr("src", visitingStudent.listings[i].coverImage)))
            }

            if (visitingStudent.listings[i].title !== undefined) {
                topContentObject.append($('<p class="title">').text('Title: ' + visitingStudent.listings[i].title))
            }

            if (visitingStudent.listings[i].edition !== undefined) {
                topContentObject.append($('<p class="edition">').text('Ed: ' + visitingStudent.listings[i].edition))
            }

            if (visitingStudent.listings[i].author !== undefined) {
                topContentObject.append($('<p class="author">').text('Author: ' + visitingStudent.listings[i].author))
            }

            if (visitingStudent.listings[i].isbn !== undefined) {
                topContentObject.append($('<p class="isbn">').text('ISBN: ' + visitingStudent.listings[i].isbn))
            }

            if (visitingStudent.listings[i].price !== undefined) {
                bottomContentObject.append($('<p class="price">').text('Asking Price : $' + visitingStudent.listings[i].price))
            }

            if (visitingStudent.listings[i].condition !== undefined) {
                bottomContentObject.append($('<p class="condition">').text('Condition: ' + visitingStudent.listings[i].condition))
            }

            if (visitingStudent.listings[i].condition_comments !== undefined) {
                bottomContentObject.append($('<p class="title">').text('Comments: ' + visitingStudent.listings[i].condition_comments))
            }

            listingObject.append(topContentObject);
            listingObject.append(bottomContentObject);
            listingObject.append(buttonContainerObject);
            listingContainer.append(listingObject);

            if (visitingStudent.listings[i].sold !== true){
                buttonContainerObject.append($('<button class="reserve-button" type="button">')
                    .text('Reserve Listing')
                    .click(function (e) {
                        e.preventDefault();
                        reserveListing($(this).parent().attr("id"));
                }));
            }

            if (visitingStudent.listings[i].selling === true){
                $('#listing').append(listingContainer).append($('<br />'));
            } else {
                $('#wishList').append(listingContainer).append($('<br />'));
            }
        }
    }

    function reserveListing(listingId) {
        var body = {};
        body["sold"] = true;
        body["otherStudentId"] = student._id
        $.ajax({
            url: apiUrl + 'listings/' + listingId,
            type: 'PUT',
            dataType: 'JSON',
            data: body,
            success: function (data) {
                $('#' + listingId).remove();
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    function loadOtherStudent(otherStudentId, container){
        var tempStudent;
        $.ajax({
            url: apiUrl + 'students/' + otherStudentId,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    tempStudent = data;
                    console.log(data);
                    var sellerInfo = $('<div class="soldTo">');
                    sellerInfo.append($('<p class="seller">').text(tempStudent.firstName + ' ' + tempStudent.lastName))
                    var button = $('<button id="'+tempStudent.email+ '" class="other-student-button">').text('Go to Profile');        
                    button.click(function (e){
                        e.preventDefault();
                        sessionStorage.setItem("visitingProfileEmail", $(this).attr("id"));
                        window.location = './view_profile.html';
                    }); 
                sellerInfo.append(button);
                container.append(sellerInfo);
                } else {
                    console.log("User not Found");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
            }
        });
    }

    $(document).ready(function () {
        checkIfUser();
    });
})();