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
    for (let i = 0; i < 100; i++) {
        const rng = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 500000);
        const property = new Property({
            location: `${city_list[rng].city}, ${city_list[rng].state}`,
            title: `${random_selector(descriptors)} ${random_selector(p_types)}`,
            image: 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis id inventore placeat odio dignissimos qui eligendi nobis fugiat, ea tempore soluta architecto. Unde esse delectus, porro placeat temporibus cumque incidunt. Excepturi reiciendis facilis cupiditate voluptatum possimus inventore, veniam explicabo ut doloribus, quibusdam harum cumque necessitatibus quas a odio repudiandae, tempora atque voluptatibus error in quis magnam quod! Omnis, illum eos.'
        })
        await property.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})