var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

//USER SCHEMA
var Schema = mongoose.Schema;
var userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, unique: true },
    city: { type: String },
    state: { type: String },
    myimages: [{ img: String, title: String, url: String, likes: String }],
    liked: [{ img: String }]

});

//'myuser' creates a new collection within mongodb
var User = mongoose.model('user', userSchema);
module.exports = User;

//CREATE USER with ENCRYPTION
module.exports.createUser = function(newUser, callback) {
    //var bcrypt = require('bcryptjs');
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(newUser.password, salt, function(err, hash) {
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.getUserByUsername = function(username, callback) {
    var query = { username: username };
    User.findOne(query, callback);
};

module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
};