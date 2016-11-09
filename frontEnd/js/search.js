(function () {
    "use strict";
    var student = {};
    var listings;
    var shownListings;
    var apiUrl = "https://rose-hulman-textbook-exchange.herokuapp.com/";
    var searchByTitle = false;
    var searchByISBN = false; 
    var searchByAuthor = false;
    var filterByCondition = false;
    var filterCondition = "";
    var filterByPrice = false;
    var filterMinPrice = 0;
    var filterMaxPrice = 9999999999;
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
            window.location = "./home_page.html";
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
            if(filterByPrice){
                if(parseInt(shownListings[i].price) < filterMinPrice || parseInt(shownListings[i].price) > filterMaxPrice){
                    continue;
                }
            }
            if(filterByCondition){
                if((shownListings[i].condition.toLowerCase() !== filterCondition) && (shownListings[i].condition.toLowerCase() !== "none"))  {
                    continue;
                }
            }
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
        searchField = $('[name="search"]').val().toString();
        var searchType = $('[name="searchType"] :selected').text();
        var priceCheckBox = $('[name="priceRange"]').is(':checked');
        var conditionCheckBox = $('[name="condition"]').is(':checked');
        searchByTitle = false; 
        searchByISBN = false; 
        searchByAuthor = false;
        filterByCondition = false;
        filterByPrice = false;
        if(searchType === "Title"){
            searchByTitle = true;
        }else if(searchType === "ISBN"){
            searchByISBN = true;
        }else if (searchType === "Author"){
            searchByAuthor = true;
        }
        if(priceCheckBox){
            filterByPrice = true;
            filterMinPrice = parseInt($('[name="priceMin"]').val().toString());
            filterMaxPrice = parseInt($('[name="priceMax"]').val().toString());
        }
        if(conditionCheckBox){
            filterByCondition = true;
            filterCondition = $('[name="conditionSelected"] :selected').val();
        }
        
        console.log('Search: Title? ' + searchByTitle + " | ISBN? " + searchByISBN + " | Author? " + searchByAuthor);
        
        console.log('Filter: Price?' + filterByPrice + ' | Condition? ' + filterByCondition)
        
        console.log('Price: ' + filterMinPrice + ' - > ' +filterMaxPrice);
        console.log('Selected Condition: ' + filterCondition);
        
        //Clear out the divs
        $('#listing').html("");
        $('#wishList').html("");
        loadListings();
        //document.getElementById("defaultOpen").click();
    }
    
    $('[name="search"]').on('input', search);
    $('[name="condition"]').on('click', search);
    $('[name="priceRange"]').on('click', search);
    $('[name="conditionSelected"]').on('click', search);
    $('[name="priceMin"]').on('input', search);
    $('[name="priceMax"]').on('input', search);

    $(document).ready(function () {
        checkIfUserLoggedIn();
    });
})();