var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');

module.exports = function(passport) {

    // Serialize the user for the session.
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // Deserialize the user when finished.
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // Local strategy for user login.
    passport.use('login', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },

    // Pass the username and password into a callback function.
    function(req, username, password, done) {

        // Look for a user with the same username.
        User.findOne({'username': username}, function(err, user) {
            // Return any errors.
            if (err) {
                return done(err);
            }

            // Return if the user does not exist.
            if (!user) {
                return done(null, false);
            }

            // Return if the password is incorrect.
            if (!user.validPassword(password)) {
                return done(null, false);
            }

            // Return user if login is successful.
            return done(null, user);
        });

    }));

    // Local strategy for user registration.
    passport.use('register', new LocalStrategy({
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true
    },

    // Pass the username and password into a callback function.
    function(req, username, password, done) {
        // Make the registration request asynchronous.
        process.nextTick(function() {
            // Look for a user with the same username.
            User.findOne({'username': username}, function(err, user) {
                // Return any errors.
                if (err) {
                    return done(err);
                }

                // Return if a user exists;
                if (user) {
                    return done(null, false);
                }

                // No users found; create a new user.
                var newUser = new User();
                // Set the new user's account information.
                newUser.username = username;
                newUser.password = newUser.generateHash(password);
                newUser.wallet = {};
                // Save the new user.
                newUser.save(function(err) {
                    if (err) {
                        throw err;
                    }
                    return done(null, newUser);
                });

            });

        });

    }));

};
