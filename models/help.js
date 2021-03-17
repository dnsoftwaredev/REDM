const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helpSchema = new Schema({
    body: String,
    rating: Number,
});

module.exports = mongoose.model('Help', helpSchema);