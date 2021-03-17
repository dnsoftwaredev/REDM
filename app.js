const express = require('express');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const path = require('path');
const catchAsync = require('./utils/catchAsync');
const EError = require('./utils/EError');
const Property = require('./models/property');
const Help = require('./models/help');
const {propertySchema, helpSchema} = require('./schemas.js');

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

const validateProperty = (req, res, next) => {
    const {error} = propertySchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new EError(msg, 400)
    } else {
        next();
    }
}

const validateHelp = (req, res, next) => {
    const {error} = helpSchema.validate(req.body);
    if(error) {
        const msg = error.detailts.map(el => el.message).join(',')
        throw new EError(msg, 400)
    } else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/properties', catchAsync(async (req, res) => {
    const properties = await Property.find({});
    res.render('properties/index', { properties });
}));

app.get('/properties/new', async (req, res) => {
    res.render('properties/new');
});

app.post('/properties', validateProperty, catchAsync(async (req, res) => {
    const property = new Property(req.body.property);
    await property.save();
    res.redirect(`/properties/${property._id}`)
}));

app.get('/properties/:id', catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id).populate('helps');
    res.render('properties/show', { property });
}));

app.get('/properties/:id/edit', catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    res.render('properties/edit', { property });
}));

app.put('/properties/:id', validateProperty, catchAsync(async (req, res) => {
    const property = await Property.findByIdAndUpdate(req.params.id, {...req.body.property});
    res.redirect(`/properties/${property._id}`);
}));

app.delete('/properties/:id', catchAsync(async (req, res) => {
    await Property.findByIdAndDelete(req.params.id);
    res.redirect('/properties');
}));

app.post('/properties/:id/helps', validateHelp, catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    const help = new Help(req.body.help);
    property.helps.push(help);
    await help.save();
    await property.save();
    res.redirect(`/properties/${property._id}`);
}))

app.delete('/properties/:id/helps/:helpId', catchAsync(async (req, res) => {
    const {id, helpId} = req.params;
    await Property.findByIdAndUpdate(id, {$pull: {helps: helpId}});
    await Help.findByIdAndDelete(helpId);
    res.redirect(`/properties/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new EError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong!";
    res.status(statusCode).render('error', {err})
})

app.listen(3000, () => {
    console.log('On Port 3000')
});
