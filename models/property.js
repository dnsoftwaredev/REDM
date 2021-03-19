const mongoose = require('mongoose');
const Help = require('./help');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200');
});
// virtual object that will repalce the url so less data is consumed + cropped images

const PropertySchema = new Schema({
    title: String,
    images: [ImageSchema],
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