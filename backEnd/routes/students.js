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

// READY to build our API
router.route('/')
    // GET all students
    .get(function (req, res, next) {
        mongoose.model('Student').find({}, function (err, students) {
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
        mongoose.model('Student').create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            major: req.body.major,
            password: req.body.password,
            listings : []
        }, function (err, student) {
            if (err) {
                res.send('Problem adding student to db.');
            } else {
                res.format({
                    json: function () {
                        res.json(student);
                    }
                });
            }
        });
    });


// READY to build our API
router.route('/login/')
    // GET all contacts
    .post(function (req, res, next) {
        mongoose.model('Student').findOne({email: req.body.email}, function (err, student) {
            if (err) {
                return console.log(err);
            } else {
                if (student.password == req.body.password){
                    res.format({
                        json: function () {
                            res.json(student);
                        }
                    });
                } else {
                    res.status(404);
                    err = new Error('Bad Password');
                    err.status = 404;
                    res.format({
                    // html: function(){
                    //     next(err);
                    // },
                    json: function () {
                        res.json({ message: err.status + ' ' + err });
                    }
            });
                }
            }
        });
    });

// route middleware to validata :id
router.param('id', function (req, res, next, id) {
    mongoose.model('Student').findById(id, function (err, student) {
        if (err || student === null) {
            res.status(404);
            err = new Error('Not Found');
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
            req.id = id;
            next();
        }
    });
});

router.route('/:id')
    .get(function (req, res) {
        mongoose.model('Student').findById(req.id, function (err, student) {
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
    .put(function (req, res) {
        mongoose.model('Student').findById(req.id, function (err, student) {
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
    })
    .delete(function (req, res) {
        mongoose.model('Student').findByIdAndRemove(req.id)
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
                    res.status(204);
                    res.format({
                        json: function () {
                            res.json(null);
                        }
                    });
                }
            }
            );
    });

module.exports = router;
