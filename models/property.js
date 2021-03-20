const mongoose = require('mongoose');
const Help = require('./help');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});
// virtual object that will repalce the url so less data is consumed + cropped images

const opts = {
    toJSON: { virtuals: true },
    toObject: {virtuals: true},
} // mongoose set virtual props to true

const PropertySchema = new Schema({
    title: String,
    images: [ImageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    price: Number,
    revenue: Number,
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
}, opts);

PropertySchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/properties/${this._id}">${this.title}</a><strong>
    <p class="mb-0 light-font">$${this.price}</p>
    <p class="mb-n2 light-font">${this.description.substring(0, 30)}...</p>
    `
});

// cap rate calculated with 50% rule
PropertySchema.virtual('capRate50').get(function () {
    const capRate = Number.parseFloat(this.revenue / this.price * 100 / 2).toPrecision(3);
    return capRate;
});

PropertySchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Help.deleteMany({
            _id: {
                $in: doc.helps
            }
        })
    }
})

module.exports = mongoose.model('Property', PropertySchema);