var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var studentSchema  = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    major: String,
    password: String,
    listings: [{ type: Schema.Types.ObjectId , ref: 'Listing' }]
});

mongoose.model('Student', studentSchema);
