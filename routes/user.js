const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// User model
const User = require('../models/User');

// Login
router.get('/login', function(req, res) {
    res.render('login');
});

// Register
router.get('/register', function(req, res) {
    res.render('register');
});

// Register Handle 
router.post('/register', function(req, res) {
    const {name, email, password, password2} = req.body;
    let errors = [];

    // Check required fields
    if(!name || !email || !password || !password2) {
        errors.push({ msg: 'All field are required' });
    }

    // Check password match
    if(password !== password2) {
        errors.push({ msg: 'passwords do not match' });
    }

    // Check password length
    if(password.length < 6) {
        errors.push({ msg: 'password should be at least 6 characters' });
    }

    if(errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        // Validation passed
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                // User exist
                errors.push({ msg: 'Email is already registered' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                // Hash password
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(newUser.password, salt, function(err,hash) {
                        if(err) throw err;
                        // Set password to hashed
                        newUser.save()
                        .then(user => {
                            req.flash('success_msg', 'Successfully registered, please log in');
                            res.redirect('/user/login');
                        })
                        .catch(err => console.log(err));

                    })
                })
            }
        });
    }

});

// Login handle
router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
});

module.exports = router;