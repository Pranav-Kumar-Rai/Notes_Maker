var mongoose = require('mongoose');

var classSchema = mongoose.Schema({
    text: String,
    filename: String,
    class_name: String

});

module.exports = mongoose.model("class_name", classSchema);