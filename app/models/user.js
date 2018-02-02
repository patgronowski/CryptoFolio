const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const bcrypt   = require('bcrypt-nodejs');

// USER SCHEMA

var userSchema = mongoose.Schema({

    username: String,
    password: String,

    wallet: {

    }

});


// USER METHODS

// Generate a hash for the password.
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
};

// Check if the password is valid.
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// Export the user model.
module.exports = mongoose.model('team-undefined-user', userSchema);
