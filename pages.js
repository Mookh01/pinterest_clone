var express = require("express");
var http = require("http");
var fs = require("fs");
var myimages = require('./models/image.js');
var user = require('./models/user.js');

var router = express.Router();
module.exports = router;

router.get('/source', function(req, res) {});
router.post('/source', function(req, res) {
    var newImage = myimages({
        img: req.body.urlimage,
        title: req.body.title,
        likes: 0,
        owner: req.user.id
    });
    newImage.save(function(err) {
        if (err) throw err;
    });
    res.redirect("/userimg")
});

router.get('/likes', function(req, res) {});

router.post('/likes', function(req, res) {
    user.find({ "_id": req.user.id }, function(err, usr) {
        var likedImages = usr[0].liked;
        var imageArrayLength = likedImages.length;
        if (imageArrayLength === 0) {
            likeImage();
        } else if (imageArrayLength > 0) {
            var count = [];
            for (var i = 0; i < imageArrayLength; i++) {
                var imageUrl = likedImages[i].img;
                if (req.body.image === imageUrl) {
                    unLikeImage();
                } else if (req.body.image !== imageUrl) {
                    count.push(imageUrl);
                    if (count.length === imageArrayLength) {
                        likeImage();
                    }
                }
            }
        };
    });

    function likeImage() {
        myimages.update({ "title": req.body.title }, { $inc: { 'likes': 1 } }, function(err, library) {
            if (err) throw err;
            var likedImg = { "img": req.body.image }
            user.findByIdAndUpdate(req.user.id, { $push: { "liked": likedImg } }, function(err, item) { return; });
        });
    }

    function unLikeImage() {
        myimages.update({ "title": req.body.title }, { $inc: { 'likes': -1 } }, function(err, img) {
            if (err) throw err;
            var unlikedImg = { "img": req.body.image }
            user.findByIdAndUpdate(req.user.id, { $pull: { "liked": unlikedImg } }, function(err, item) { return; });
        });
    };

});




router.get('/permanentRemoval', function(req, res) {

});
router.post('/permanentRemoval', function(req, res) {
    myimages.findOne({ "title": req.body.title }, function(err, result) {
        if (err) throw err;
        result.remove(function(err) {});
    });
    res.redirect("/");
});



router.get('/:id', function(req, res) {
    myimages.find({ "owner": req.params.id }, function(err, data) {
        if (err) throw err;
        user.findOne({ "_id": req.params.id }, function(err, usr) {
            res.render('guestpage', {
                library: data,
                creator: usr.username
            });
        });
    })

});