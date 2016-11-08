(function () {
    "use strict";
    var student = {}
    var apiUrl = "http://localhost:3000/";

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
            url: apiUrl + 'students/' + student._id + "/withListings/",
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    student = data;
                    displayProfile();
                } else {
                    console.log("User not Found");
                    window.location = "index.html"
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
                window.location = "home_page.html"
            }
        });
    }

    function displayProfile() {
        $('#user-fullname').text('Name: ' + student.firstName + ' ' + student.lastName);
        $('#user-major').text('Major: ' + student.major);
        $('#user-email').text('Email: ' + student.email);
        if (student.coverImage !== undefined && student.coverImage !== "") {
            $('#user-icon').html(' ').append($('<img src=' + student.coverImage + '>'))
        } else {
            $('#user-icon').html(' ').append($('<img src="../images/RoseSeal.png" alt="User icon"></img>'))
        }
        $('#edit').attr("hidden", false);
        loadListings();
        addListing();
        document.getElementById('listing').style.display = "block";    
    }

    function loadListings(){
        for(var i = 0 ; i < student.listings.length; i++) {
            var listingContainer = $('<div class="listing" id=\"'+student.listings[i]._id+ '\">')
            var listingObject = $('<div class="listingDiv" >')  

            var topContentObject = $('<div class="topContent" >')
            var bottomContentObject = $('<div class="bottomContent" >')
            var buttonContainerObject = $('<div class="buttonContainer" >')  

            if (student.listings[i].coverImage !== undefined) {
                topContentObject.append($('<img class="coverImage">').attr("src", student.listings[i].coverImage))
            }

            if (student.listings[i].title !== undefined) {
                topContentObject.append($('<p class="title">').text('Title: ' + student.listings[i].title))
            }
            if (student.listings[i].edition !== undefined) {
                topContentObject.append($('<p class="edition">').text('Ed: ' + student.listings[i].edition))
            }
            if (student.listings[i].author !== undefined) {
                topContentObject.append($('<p class="author">').text('Author: ' + student.listings[i].author))
            }
            if (student.listings[i].isbn !== undefined) {
                topContentObject.append($('<p class="isbn">').text('ISBN: ' + student.listings[i].isbn))
            }

            if (student.listings[i].price !== undefined) {
                bottomContentObject.append($('<p class="price">').text('Asking Price : $' + student.listings[i].price))
            }
            if (student.listings[i].condition !== undefined) {
                bottomContentObject.append($('<p class="condition">').text('Condition: ' + student.listings[i].condition))
            }
            if (student.listings[i].condition_comments !== undefined) {
                bottomContentObject.append($('<p class="title">').text('Comments: ' + student.listings[i].condition_comments))
            }
            

            if (student.listings[i].sold === true){
                loadOtherStudent(student.listings[i].otherStudentId, listingContainer);
            } else {
                buttonContainerObject.append($('<button class="delete-button" type="button">')
                    .text('Delete Listing')
                    .click(function (e) {
                        e.preventDefault();
                        deleteListing($(this).parent().attr("id"));
                }));
            }

            listingObject.append(topContentObject);
            listingObject.append(bottomContentObject);
            listingObject.append(buttonContainerObject);
            listingContainer.append(listingObject);

            if (student.listings[i].selling === true){
                $('#listing').append(listingContainer).append($('<br />'));
            } else {
                $('#wishList').append(listingContainer).append($('<br />'));
            }
        }
    }

    function addListing() {
        $("#addNewListing").html('<object id="addListingPage" type="text/html" data="add_Listing.html" ></object>');
    }

    function deleteListing( listingId) {
        $.ajax({
            url: apiUrl + 'listings/' + listingId + '/student/' + student._id,
            type: 'DELETE',
            dataType: 'JSON',
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
        checkIfUserLoggedIn();
    });
})();