var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), // mongodb connection
    bodyParser = require('body-parser'), // parse info from POST
    methodOverride = require('method-override');  // used to manipulate POST data

router.use(bodyParser.urlencoded({ extended: true }));
router.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body == 'object' && '_method' in req.body) {
        var method = req.body._method;
        delete req.body._method;
        return method;
    }
}));

function handleError(err, res, msg, statusCode) {
    res.status(statusCode);
    err = new Error(msg);
    err.status = statusCode;
    res.json({ message: err.status + ' ' + err }); // shorter but works
}

function removeListing(req, res, student, listingId) {
    var thisListingIndex = -1;
    if (student.listings.length) {
        for (var i = 0; i < student.listings.length; i++) {
            if (student.listings[i]._id == listingId) {
                thisListingIndex = i;
                break;
            }
        }
        if (thisListingIndex < 0) {
            res.status(404);
                err = new Error("Couldn't find listing to delete for student.");
                err.status = 404;
                res.format({
                    json: function () {
                        res.json({ message: err.status + ' ' + err });
                    }
                });
        } else {
            student.listings.splice(thisListingIndex, 1);
            student.save(function (err, book) {
                if (err) {
                    handleError(err, res, 'Could not delete Listing', 400);
                } else {
                    res.status(204);
                    res.json(null);// shorter but works
                }
            });
        }

    } else {
        handleError(new Error(), res, 'Could not delete Listing', 400);
    }
}

function updateStudent( req, res, listing) {
    mongoose.model('Student').findById(req.studentId, function (err, student) {
        student.listings.push(listing._id);
        student.save(function (err, person) {
            if (err) {
                res.status(404);
                err = new Error('Problem updating student after making listing');
                err.status = 404;
                res.format({
                    json: function () {
                        res.json({ message: err.status + ' ' + err });
                    }
                });
            } else {
                res.format({
                    json: function () {
                        res.json(person);
                    }
                });
            }
        });
    });
}

// READY to build our API
router.route('/')
    // GET all listings
    .get(function (req, res, next) {
        mongoose.model('Listing').find({})
            .populate('ownerId')
            .exec(function (err, students) {
                if (err) {
                    return console.log(err);
                } else {
                    res.format({
                        json: function () {
                            res.json(students);
                        }
                    });
                }
            });
    });
    // READY to build our API
router.route('/selling/')
    // GET all listings
    .get(function (req, res, next) {
        mongoose.model('Listing').find({ selling: true})
            .populate('ownerId')
            .exec(function (err, students) {
                if (err) {
                    return console.log(err);
                } else {
                    res.format({
                        json: function () {
                            res.json(students);
                        }
                    });
                }
            });
    });
    // READY to build our API
router.route('/buying/')
    // GET all listings
    .get(function (req, res, next) {
        mongoose.model('Listing').find({selling: false})
            .populate('ownerId')
            .exec(function (err, students) {
                if (err) {
                    return console.log(err);
                } else {
                    res.format({
                        json: function () {
                            res.json(students);
                        }
                    });
                }
            });
    });
router.route('/students/:studentId')
    //New Listing
    .get(function (req, res, next) {
        mongoose.model('Listing').find({ 
            ownerId : req.studentId
        }, function (err, students) {
            if (err) {
                return console.log(err);
            } else {
                res.format({
                    json: function () {
                        res.json(students);
                    }
                });
            }
        });
    })
    .post(function (req, res) {
        mongoose.model('Listing').create({
            
            title: req.body.title,
            coverImage: req.body.coverImage,
            isbn: req.body.isbn,
            edition: req.body.edition,
            author: req.body.author,
            price: req.body.price,
            condition: req.body.condition,
            condition_comments: req.body.condition_comments,
            selling: req.body.selling,
            sold: false,
            ownerId: req.studentId

        }, function (err, listing) {
            if (err) {
                res.send('Problem adding listing to db.');
            } else {
                //add the listing to the student's listings'
                updateStudent(req, res, listing);
            }
        });
    });
router.route('/:listingId')
    //getting specific listing
    .get(function (req, res) {
        mongoose.model('Listing').findById(req.listingId, function (err, student) {
            if (err) {
                res.status(404);
                err = new Error('GET error, problem retrieving data');
                err.status = 404;
                res.format({
                    json: function () {
                        res.json({ message: err.status + ' ' + err });
                    }
                });
            } else {
                res.format({
                    json: function () {
                        res.json(student);
                    }
                });
            }
        });
    })
    //updating listing
    .put(function (req, res) {
        mongoose.model('Listing').findById(req.listingId, function (err, student) {
            student.firstName = req.body.firstName || student.firstName;
            student.lastName = req.body.lastName || student.lastName;
            student.email = req.body.email || student.email;
            student.major = req.body.major || student.major;
            student.password = req.body.password || student.password;
            //student.listings = req.body.listings || student.listings;
            //should edit listings individually
            student.save(function (err, person) {
                if (err) {
                    res.status(404);
                    err = new Error('Problem updating student');
                    err.status = 404;
                    res.format({
                        json: function () {
                            res.json({ message: err.status + ' ' + err });
                        }
                    });
                } else {
                    res.format({
                        json: function () {
                            res.json(person);
                        }
                    });
                }
            });
        });
    });

router.route('/:listingId/student/:studentId')
    .delete(function (req, res) {
        mongoose.model('Listing').findByIdAndRemove(req.listingId)
            .exec(
            function (err, student) {
                if (err) {
                    res.status(404);
                    err = new Error('Problem deleting student');
                    err.status = 404;
                    res.format({
                        json: function () {
                            res.json({ message: err.status + ' ' + err });
                        }
                    });
                } else {
                    mongoose.model('Student').findById(req.studentId, function(err, student){
                        removeListing(req, res, student, req.listingId);
                    });
                }
            }
            );
    });


// route middleware to validata :studentId
router.param('studentId', function (req, res, next, id) {
    mongoose.model('Student').findById(id, function (err, student) {
        if (err || student === null) {
            res.status(404);
            err = new Error('Student Not Found');
            err.status = 404;
            res.format({
                // html: function(){
                //     next(err);
                // },
                json: function () {
                    res.json({ message: err.status + ' ' + err });
                }
            });
        } else {
            // once validation is done, save new id in the req
            req.studentId = id;
            next();
        }
    });
});

// route middleware to validata :listingId
router.param('listingId', function (req, res, next, id) {
    mongoose.model('Listing').findById(id, function (err, student) {
        if (err || student === null) {
            res.status(404);
            err = new Error('Listing Not Found');
            err.status = 404;
            res.format({
                // html: function(){
                //     next(err);
                // },
                json: function () {
                    res.json({ message: err.status + ' ' + err });
                }
            });
        } else {
            // once validation is done, save new id in the req
            req.listingId = id;
            next();
        }
    });
});

module.exports = router;
