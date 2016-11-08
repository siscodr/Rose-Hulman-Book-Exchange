(function () {
    "use strict";
    var student = {}
    var listings;
    var shownListings;
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
                window.location = "./home_page.html"
            } else {
                getUserById();
            }
        }
    }

    function getUserById() {
        $.ajax({
            url: apiUrl + 'students/' + student._id,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    student = data;
                    addListing();
                    getListings();
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

    function getListings(){
        $.ajax({
            url: apiUrl + 'listings/students/' + student._id,
            type: 'GET',
            dataType: 'JSON',
            success: function (data) {
                if (data) {
                    console.log(data);
                    listings = data;
                    shownListings = data;    
                    loadListings();
                } else {
                    console.log("Listings not Found");
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
                window.location = "./home_page.html"
            }
        });
    }

    function loadListings(){
        for(var i = 0 ; i < shownListings.length; i++) {
            var listingContainer = $('<div class="listing" id=\"'+shownListings[i]._id+ '\">')
            var listingObject = $('<div class="listingDiv" >')

            var topContentObject = $('<div class="topContent" >')
            var bottomContentObject = $('<div class="bottomContent" >')
            var buttonContainerObject = $('<div class="buttonContainer" >')  

            if (shownListings[i].coverImage !== undefined) {
                topContentObject.append($('<div class="coverImageContainer">').append($('<img class="coverImage">').attr("src", shownListings[i].coverImage)))
            }
            if (shownListings[i].title !== undefined) {
                topContentObject.append($('<p class="title">').append('<span class="labels">Title: </span>').append(shownListings[i].title))
            }
            if (shownListings[i].edition !== undefined) {
                topContentObject.append($('<p class="edition">').append('<span class="labels">Edition: </span>').append(shownListings[i].edition))
            }
            if (shownListings[i].author !== undefined) {
                topContentObject.append($('<p class="author">').append('<span class="labels">Author: </span>').append(shownListings[i].author))
            }
            if (shownListings[i].isbn !== undefined) {
                topContentObject.append($('<p class="isbn">').append('<span class="labels">Isbn: </span>').append(shownListings[i].isbn))
            }
            if (shownListings[i].price !== undefined) {
                bottomContentObject.append($('<p class="price">').append('<span class="labels">Asking Price: </span>').append('$' + shownListings[i].price))
            }
            if (shownListings[i].condition !== undefined) {
                bottomContentObject.append($('<p class="condition">').append('<span class="labels">Condition: </span>').append(shownListings[i].condition))
            }
            if (shownListings[i].condition_comments !== undefined) {
                bottomContentObject.append($('<p class="title">').append('<span class="labels">Comments: </span>').append(shownListings[i].condition_comments))
            }
            
            if (shownListings[i].sold === true){
                var sellerInfo = loadOtherStudent(shownListings[i].otherStudentId);
            } else {
                buttonContainerObject.append($('<button class="reserve-button" type="button">')
                    .text('Reserve Listing')
                    .click(function (e) {
                        e.preventDefault();
                        reserveListing($(".listingDiv").parent().attr("id"));
                }));
            }

            listingObject.append(topContentObject);
            listingObject.append(bottomContentObject);
            listingObject.append(buttonContainerObject);
            listingContainer.append(listingObject);

            if (shownListings[i].selling === true){
                $('#listing').append(listingContainer).append($('<br />'));
            } else {
                $('#wishList').append(listingContainer).append($('<br />'));
            }
        }
    }

    function addListing() {
        $("#addNewListing").html('<object id="addListingPage" type="text/html" data="add_Listing.html" ></object>');
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

    function loadOtherStudent(otherStudent){
        var tempStudent = otherStudent;
        var sellerInfo = $('<div class="soldTo">');
        sellerInfo.append($('<p class="seller">').text(tempStudent.firstName + ' ' + tempStudent.lastName))
        var button = $('<button id="'+tempStudent.email+ '" class="other-student-button">').text('Go to Profile');        
        button.click(function (e){
            e.preventDefault();
            sessionStorage.setItem("visitingProfileEmail", $(this).attr("id"));
            window.location('./view_profile');
        });
        sellerInfo.append(button);
        return sellerInfo;
    }

    $(document).ready(function () {
        checkIfUserLoggedIn();
    });
})();