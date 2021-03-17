const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const Property = require('./models/property');

mongoose.connect('mongodb://localhost:27017/redm', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
});

const db = mongoose.connection;
const app = express();

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database ready');
});


app.set('views', path.join(__dirname, 'views'))
app.engine('ejs', ejsMate); // template engine
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/properties', async (req, res) => {
    const properties = await Property.find({});
    res.render('properties/index', { properties });
});

app.get('/properties/new', async (req, res) => {
    res.render('properties/new');
});

app.post('/properties', async (req, res) => {
    const property = new Property(req.body.property);
    await property.save();
    res.redirect(`/properties/${property._id}`)
});

app.get('/properties/:id', async (req, res) => {
    const property = await Property.findById(req.params.id);
    res.render('properties/show', { property });
})

app.get('/properties/:id/edit', async (req, res) => {
    const property = await Property.findById(req.params.id);
    res.render('properties/edit', { property });
});

app.put('/properties/:id', async (req, res) => {
    const property = await Property.findByIdAndUpdate(req.params.id, {...req.body.property});
    res.redirect(`/properties/${property._id}`);
});

app.delete('/properties/:id', async (req, res) => {
    await Property.findByIdAndDelete(req.params.id);
    res.redirect('/properties');
});

app.listen(3000, () => {
    console.log('On Port 3000')
});
