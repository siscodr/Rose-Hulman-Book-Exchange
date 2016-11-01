(function () {
    "use strict";
    var apiUrl = "https://localhost:3000/users/listings/";
    var listing;
    var editForm = false;
    // FormsFields will be used when creating the forms
    var formFields = [
        { name: "title", des: "Title", type: "text", required: true },
        { name: "isbn", des: "ISBN", type: "text", required: true },
        { name: "edition", des: "Edition", type: "email", required: true },
        { name: "author", des: "Author", type: "text", required: false },
        { name: "price", des: "Price", type: "number", required: true },
        { name: "condition", des: "Condition", type: "text", required: true },
        { name: "conditionComments", des: "Condition Comments", type: "text", required: true },
        { name: "forSale", des: "Selling/Wishlist", type: "text", required: true }
    ];

    // Update listing
    function inputHandler(property, value) {
        listing[property] = value;
    }

    // Add create new Listing button
    function addNewButton(formElement) {
        formElement.append('<button type="submit" id="new-listing-button"> Submit New Listing </button>');
        $('#new-listing-button').click(function (e) {
            e.preventDefault(); // Prevent querystring from showing up in address bar
            createUser();
        });
    }

    // populate the user form with the necessary fields
    function createForm() {
        var formElement = $("[name='addListingForm']").empty();
        // Add form elements and their event listeners
        formFields.forEach(function (formField) {
            var labelElement = $("<label>")
                .attr("for", formField.name)
                .text(formField.des);
            formElement.append(labelElement);
            var inputElement = $("<input>")
                .attr("type", formField.type)
                .attr("name", formField.name)
                .attr("value", (listing[formField.name] || ""));
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
        //Condition Select
        var labelElement = $("<label>")
            .attr("for", "condition")
            .text("Condition");
        formElement.append(labelElement);
        var inputElement = $("<select>")
            .attr("name", "condition");
        var selectElement = $("<option>")
            .attr("value", "new")
            .text("New");
        inputElement.append(selectElement);
        var selectElement = $("<option>")
            .attr("value", "likeNew")
            .text("Like New");
        inputElement.append(selectElement);
        var selectElement = $("<option>")
            .attr("value", "satisfactory")
            .text("Satisfactory");
        inputElement.append(selectElement);
        var selectElement = $("<option>")
            .attr("value", "fair")
            .text("Fair");
        inputElement.append(selectElement);
        var selectElement = $("<option>")
            .attr("value", "poor")
            .text("Poor");
        inputElement.append(selectElement);
        inputElement.prop("required", true).attr("aria-required", "true");
        formElement.append(inputElement);
        inputElement.on('input', function () {
            var thisField = $(this);
            inputHandler(formField.name, thisField.val());
        });
        // clear the horizontal and vertical space next to the 
        // previous element
        formElement.append('<div style="clear:both"></div>');
        //Wishlist Select
        var labelElement = $("<label>")
            .attr("for", "listing")
            .text("Selling/Wishlist");
        formElement.append(labelElement);
        var inputElement = $("<select>")
            .attr("name", "listing");
        var selectElement = $("<option>")
            .attr("value", "true")
            .text("Selling");
        inputElement.append(selectElement);
        var selectElement = $("<option>")
            .attr("value", "false")
            .text("Wishlist");
        inputElement.append(selectElement);
        inputElement.prop("required", true).attr("aria-required", "true");
        formElement.append(inputElement);
        inputElement.on('input', function () {
            var thisField = $(this);
            inputHandler(formField.name, thisField.val());
        });
        // clear the horizontal and vertical space next to the 
        // previous element
        formElement.append('<div style="clear:both"></div>');
        
        addNewButton(formElement);
    }

    // make ajax call to add new contact to db
    function createListing() {
        $.ajax({
            url: apiUrl,
            type: 'POST',
            dataType: 'JSON',
            data: listing,
            success: function (data) {
                if (data) {
                    window.location = "logged_in.html";
                } else {
                    console.log('Listing could not be retrived.');
                }
            },
            error: function (request, status, error) {
                console.log('Failed to make Listing');
                console.log(error, status, request);
            }
        });
    return;
    }

    $(document).ready(function () {
        listing = {};
        createForm();
    });

})();