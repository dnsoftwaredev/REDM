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

const seedDB = async () => {
    await Property.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const rng = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 500000);
        const revenue = Math.floor((Math.random() * 0.15) * price);
        const property = new Property({
            author: '60537d37403060371c17bafd',
            location: `${city_list[rng].city}, ${city_list[rng].state}`,
            title: `${random_selector(descriptors)} ${random_selector(p_types)}`,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis id inventore placeat odio dignissimos qui eligendi nobis fugiat, ea tempore soluta architecto. Unde esse delectus, porro placeat temporibus cumque incidunt. Excepturi reiciendis facilis cupiditate voluptatum possimus inventore',
            price: price,
            revenue: revenue,
            geometry: {
                type: 'Point',
                coordinates: [
                    city_list[rng].longitude,
                    city_list[rng].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dhgvftizb/image/upload/v1616097592/REDM/csdhkjjueyfcm0ln03fl.jpg', 
                    filename: 'REDM/photo-1570544820979-6eb25385944d_tcfrvf'  
                },
                {
                    url: 'https://res.cloudinary.com/dhgvftizb/image/upload/v1616097644/REDM/qrzbjrveip283nnlavbg.jpg', 
                    filename: 'REDM/photo-1472224371017-08207f84aaae_uecnih'
                }
            ]
        })
        await property.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})