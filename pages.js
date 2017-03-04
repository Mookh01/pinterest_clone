var express = require("express");
var http = require("http");
var fs = require("fs");
var bookdatabase = require('./models/book.js');
var user = require('./models/user.js');

var router = express.Router();
module.exports = router;

router.get('/chosen', function(req, res) {});
router.post('/chosen', function(req, res) {
    var newBook = bookdatabase({
        img: req.body.image,
        title: req.body.title,
        author: req.body.author,
        owner: req.user.id
    });
    newBook.save(function(err) {
        if (err) throw err;
        console.log("Check Mongo for saved book");
        updateUser();
    });
    var updateUser = function() {
        var additions = { img: req.body.image, title: req.body.title, author: req.body.author }
        user.findByIdAndUpdate(req.user.id, { $push: { "mybooks": additions } }, function(err, result) {
            if (err) throw err;
        });
    }

});

//pages request finds user and places the request data into the users myrequest array inside the database. 
router.get('/request', function(req, res) {});
router.post('/request', function(req, res) {
    // var currentUser = req.user.username;
    var requestInfo = { title: req.body.title, author: req.body.author }
    user.findByIdAndUpdate(req.user.id, { $push: { "myrequest": requestInfo } }, function(err, result) {
        if (err) throw err;
    });
    //Here I could use the data I have "requestInfo" and search with the criteria to find and update "requestFrom" array;
    //For which we then need to display the requestFrom data
    //Find the user with 
    console.log("title: ", req.body.title);
    console.log("author: ", req.body.author);              
    user.find().elemMatch('mybooks', { title: req.body.title, author: req.body.author }).exec(function(err, search) {
        if (err) console.error(err);
        console.log("search", search);
    });

});