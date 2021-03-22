const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const helpSchema = new Schema({
    body: String,
    rating: Number,
    vote: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model('Help', helpSchema);