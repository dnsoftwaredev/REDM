const mongoose = require('mongoose');
const Help = require('./help');
const Schema = mongoose.Schema;

const PropertySchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
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