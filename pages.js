var express = require("express");
var http = require("http");
var fs = require("fs");
var mybooks = require('./models/book.js');
var user = require('./models/user.js');

var router = express.Router();
module.exports = router;

router.get('/chosen', function(req, res) {});
router.post('/chosen', function(req, res) {
    var newBook = mybooks({
        img: req.body.image,
        title: req.body.title,
        author: req.body.author,
        owner: req.user.id
    });
    newBook.save(function(err) {
        if (err) throw err;
        updateUser();
    });
    var updateUser = function() {
        var additions = { img: req.body.image, title: req.body.title, author: req.body.author }
        user.findByIdAndUpdate(req.user.id, { $push: { "mybooks": additions } }, function(err, result) {
            if (err) throw err;
        });
    }
});
//Request For Book 
router.get('/request', function(req, res) {});
router.post('/request', function(req, res) {
    var requester = req.user.id;  
    //Owner Of Book is found          
    user.find({ 'mybooks.title': req.body.title }, function(err, search) {
        if (err) console.error(err);
        var ownerID = search[0]._id;
        var requesterId = req.user.id;
        var requestInfo = { title: req.body.title, author: req.body.author, requester: requesterId }
            //Request From is updated
        user.findByIdAndUpdate(ownerID, { $push: { "requestFrom": requestInfo } }, function(err, result) {
            if (err) throw err;
        });
        //Requesters Array updated
        var num = 0;
        var userrequest = { title: req.body.title, author: req.body.author, bookowner: ownerID }
        user.findByIdAndUpdate(requester, { $push: { "myrequest": userrequest } }, function(err, result) {
            if (err) throw err;
            res.redirect("/");
        }); 

    });




});
//user can remove their request. It will also remove request from owner. 
router.get('/remove', function(req, res) {});
router.post('/remove', function(req, res) {
    //current user id pulls the request from their list. 
    var bookowner = req.user.myrequest[0].bookowner;
    user.findByIdAndUpdate(req.user.id, { $pull: { myrequest: { "title": req.body.title } } },
        function(err, result) {
            if (err) throw err;
        });
    user.findByIdAndUpdate(bookowner, { $pull: { requestFrom: { "title": req.body.title } } },
        function(err, result) {
            if (err) throw err;
        }); 
    res.redirect("/");

});

router.get('/decline', function(req, res) {});
router.post('/decline', function(req, res) {
    //current user id pulls the request from their list. 
    var bookrequester = req.user.requestFrom[0].requester;
    //user/owner removes request from their list. 
    user.findByIdAndUpdate(req.user.id, { $pull: { requestFrom: { "title": req.body.title } } },
        function(err, result) {
            if (err) throw err;
        });
    user.findByIdAndUpdate(bookrequester, { $pull: { myrequest: { "title": req.body.title } } },
        function(err, result) {
            if (err) throw err;
        }); 

    res.redirect("/server");
});

router.get('/permanentRemoval', function(req, res) {});
router.post('/permanentRemoval', function(req, res) {
    user.findByIdAndUpdate(req.user._id, { $pull: { mybooks: { "title": req.body.title } } },
        function(err, result) {
            if (err) throw err;
        });
    mybooks.findOne({ "title": req.body.title }, function(err, result) {
        if (err) throw err;
        result.remove(function(err) {});
    });
    res.redirect("/");
});

//Book will be borrowed: remove book from user "mybooks"...
router.get('/borrowed', function(req, res) {});
router.post('/borrowed', function(req, res) {
    var borrowerId = "";
    user.findByIdAndUpdate(req.user._id, { $pull: { mybooks: { "title": req.body.title } } },

        function(err, result) {

            if (err) throw err;
            var requesterinfo = result.requestFrom;
            for (var i = 0; i < requesterinfo.length; i++) {
                if (requesterinfo[i].title === req.body.title) {
                    borrowerId = requesterinfo[i].requester;
                    mybooks.findOne({ "title": req.body.title }, function(err, library) {
                        if (err) throw err;
                        var image = library.img;
                        var ownerID = req.user._id;
                        var userrequest = { title: req.body.title, author: req.body.author, bookowner: ownerID, img: image }
                        user.findByIdAndUpdate(borrowerId, { $push: { "mybooks": userrequest } }, function(err, result) {
                            if (err) throw err;
                            res.redirect("/decline");
                        });
                    }); 

                }

            }
            user.findByIdAndUpdate(req.user.id, { $pull: { requestFrom: { "title": req.body.title } } },
                function(err, result) {
                    if (err) throw err;
                });
            user.findByIdAndUpdate(borrowerId, { $pull: { myrequest: { "title": req.body.title } } },
                function(err, result) {
                    if (err) throw err;
                });
        });

});