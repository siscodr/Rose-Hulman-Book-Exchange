var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var studentSchema  = new mongoose.Schema({
    firstName: {
        type: String,
        required : true
    },
    coverImage: String,
    lastName: {
        type: String,
        required : true
    },
    email: {
        type: String,
        required : true
    },
    major: String,
    password: {
        type: String,
        required : true
    },
    listings: {
        type: [
            { 
                type: Schema.Types.ObjectId, 
                ref: 'Listing' }
                ]
    }
});

mongoose.model('Student', studentSchema);
