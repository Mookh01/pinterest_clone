//THIS FILE WILL BE TRIGGERED DUE TO USER ACTIONS
module.exports = function(server) {
    var io = require('socket.io')(server);
    var express = require('express');
    var books = require('google-books-search');
    var mybooks = require('../models/book.js');
    var user = require('../models/user.js');

    io.on('connection', function(socket) {
        socket.on('add', function(text, cb) {
            function bookSearching() {
                var data = [];
                //GOOGLE API: Sorting info into array.
                books.search(text, function(error, results) {
                    // books.search('Professional JavaScript for Web Developers', function(error, results) {
                    if (!error) {
                        for (var i = 0; i < results.length; i++) {

                            var title = results[i].title;
                            var authors = results[i].authors;
                            var thumbnail = results[i].thumbnail;
                            data.push([thumbnail, title, authors]);
                            // data.push([thumbnail, title, authors]);


                        }
                        io.sockets.emit('create', data);
                    } else {
                        console.log(error);
                    }
                });

            }
            bookSearching();

        });

        // socket.on('store', function(inventory, cb) {
        //     console.log(inventory);
        //     var newBook = mybooks({
        //         img: inventory[0],
        //         title: inventory[1],
        //         author: inventory[2]
        //     });
        //     newBook.save(function(err) {
        //         if (err) throw err;
        //         console.log("Check Mongo for saved book");
        //         // userInformation()
        //     });


        // });
    });

    // function userInformation() {
    //     console.log("user information gather");
    // }
};