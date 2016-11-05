var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required : true
    },
    coverImage: String,
    isbn: String,
    edition: String,
    author: String,
    price: {
        type: Number,
        required : true
    },
    condition: String,
    condition_comments: String,
    selling: {
        type: Boolean,
        required : true
    },
    sold: Boolean,
    ownerId: {
        type :  Schema.Types.ObjectId , 
        ref: 'Student',
        required : true
    },
    otherStudentId: { 
        type :  Schema.Types.ObjectId , 
        ref: 'Student'
    }
});

mongoose.model('Listing', listingSchema);