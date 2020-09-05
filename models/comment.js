var mongoose = require('mongoose');

var commentSchema = mongoose.Schema({
    text: String,
    author: String,
    filename: String,
    userId: String
});

module.exports = mongoose.model("Comment", commentSchema);