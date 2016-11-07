(function () {
    "use strict";
    var student = {};
    var listings;
    var shownListings;
    var apiUrl = "http://localhost:3000/";
    var searchByTitle = false;
    var searchByISBN = false; 
    var searchByAuthor = false;
    var searchField;
    var cleanListing = $("#listing").clone();
    var cleanWishlist = $("#wishList").clone();
    

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
                window.location = "./home_page.html";
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
                    window.location = "./home_page.html";
                }
            },
            error: function (request, status, error) {
                console.log(error, status, request);
                window.location = "./home_page.html";
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
                window.location = "./home_page.html";
            }
        });
    }

    function loadListings(){
        for(var i = 0 ; i < shownListings.length; i++) {
            if(searchByAuthor){
                if(shownListings[i].author === undefined 
                   || shownListings[i].author.toLowerCase() .indexOf(searchField.toLowerCase()) == -1){
                    continue;
                }
            }
            else if(searchByISBN){
                if(shownListings[i].isbn === undefined || shownListings[i].isbn.indexOf(searchField) == -1){
                    continue;
                }
            }
            else if(searchByTitle){
                if( shownListings[i].title === undefined || shownListings[i].title.toLowerCase().indexOf(searchField.toLowerCase()) == -1){
                   continue;
                }
            }
            var listingContainer = $('<div class="listing" id=\"'+shownListings[i]._id+ '\">')
            var listingObject = $('<div class="listingDiv" >')  
            
            if (shownListings[i].title !== undefined) {
                listingObject.append($('<p class="title">').text('Title: ' + shownListings[i].title))
            }
            if (shownListings[i].edition !== undefined) {
                listingObject.append($('<p class="edition">').text('Ed: ' + shownListings[i].edition))
            }
            if (shownListings[i].author !== undefined) {
                listingObject.append($('<p class="author">').text('Author: ' + shownListings[i].author))
            }
            if (shownListings[i].isbn !== undefined) {
                listingObject.append($('<p class="isbn">').text('ISBN: ' + shownListings[i].isbn))
            }
            if (shownListings[i].coverImage !== undefined) {
                listingObject.append($('<div class="coverImageContainer">').append($('<img class="coverImage">').attr("src", shownListings[i].coverImage)))
            }
            if (shownListings[i].price !== undefined) {
                listingObject.append($('<p class="price">').text('Asking Price : $' + shownListings[i].price))
            }
            if (shownListings[i].condition !== undefined) {
                listingObject.append($('<p class="condition">').text('Condition: ' + shownListings[i].condition))
            }
            if (shownListings[i].condition_comments !== undefined) {
                listingObject.append($('<p class="title">').text('Comments: ' + shownListings[i].condition_comments))
            }
            listingContainer.append(listingObject);
            if (shownListings[i].sold === true){
                var sellerInfo = loadOtherStudent(shownListings[i].otherStudentId);
            } else {
                listingContainer.append($('<button class="reserve-button" type="button">')
                    .text('Reserve Listing')
                    .click(function (e) {
                        e.preventDefault();
                        reserveListing($(this).parent().attr("id"));
                }));
            }
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
    
    function search(){
        console.log("update");
        searchField = $('[name="search"]').val().toString();
        var searchType = $('[name="searchType"] :selected').text();
        searchByTitle = false; 
        searchByISBN = false; 
        searchByAuthor = false;
        if(searchType === "Title"){
            searchByTitle = true;
        }else if(searchType === "ISBN"){
            searchByISBN = true;
        }else if (searchType === "Author"){
            searchByAuthor = true;
        }
        //Clear out the divs
        document.getElementById("listing").innerHTML = "";
        document.getElementById("wishList").innerHTML = "";
        
        getListings();
        loadListings();
        document.getElementById("defaultOpen").click();
    }
    
    $('[name="search"]').on('input', search);

    $(document).ready(function () {
        checkIfUserLoggedIn();
    });
})();