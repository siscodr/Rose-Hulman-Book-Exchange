var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var listingSchema = new mongoose.Schema({
    title: String,
    coverImage: String,
    isbn: String,
    edition: String,
    author: String,
    price: Number,
    condition: String,
    condition_comments: String,
    selling: Boolean,
    sold: Boolean,
    ownerId: {
        type :  Schema.Types.ObjectId , 
        ref: 'Student',
        required : true
    },
    otherStudentId: Schema.Types.ObjectId
});

mongoose.model('Listing', listingSchema);