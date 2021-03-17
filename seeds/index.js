const mongoose = require('mongoose');
const city_list = require('./city_list');
const { descriptors, p_types } = require('./index_helper');
const Property = require('../models/property');

mongoose.connect('mongodb://localhost:27017/redm', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database ready');
});

const random_selector = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async() => {
    await Property.deleteMany({});
    for (let i = 0; i < 100; i++) {
        const rng = Math.floor(Math.random() * 1000);
        const property = new Property({
            location: `${city_list[rng].city}, ${city_list[rng].state}`,
            title: `${random_selector(descriptors)} ${random_selector(p_types)}`
        })
        await property.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})