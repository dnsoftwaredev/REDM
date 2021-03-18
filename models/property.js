const mongoose = require('mongoose');
const Help = require('./help');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    title: String,
    images: [
        {
            url: String,
            filename: String
        }
    ],
    price: Number,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    helps: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Help'
        }
    ]
});

PropertySchema.post('findOneAndDelete', async function(doc) {
    if (doc) {
        await Help.deleteMany({
            _id: {
                $in: doc.helps
            }
        })
    }
})

module.exports = mongoose.model('Property', PropertySchema);