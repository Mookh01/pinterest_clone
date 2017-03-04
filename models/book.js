var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bookSchema = new Schema({
    img: String,
    title: String,
    author: String,
    owner: String
});
var Book = mongoose.model('book', bookSchema);
module.exports = Book;