var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var imageSchema = new Schema({
    img: String,
    title: String,
    url: String,
    owner: String,
    likes: Number,
});
var image = mongoose.model('image', imageSchema);
module.exports = image;