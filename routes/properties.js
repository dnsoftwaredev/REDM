const express = require('express');
const router = express.Router();
const {propertySchema} = require('../schemas');
const EError = require('../utils/EError');
const Property = require('../models/property');
const catchAsync = require('../utils/catchAsync')

const validateProperty = (req, res, next) => {
    const {error} = propertySchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new EError(msg, 400)
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const properties = await Property.find({});
    res.render('properties/index', { properties });
}));

router.get('/new', async (req, res) => {
    res.render('properties/new');
});

router.post('/', validateProperty, catchAsync(async (req, res) => {
    const property = new Property(req.body.property);
    await property.save();
    res.redirect(`/properties/${property._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id).populate('helps');
    res.render('properties/show', { property });
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    res.render('properties/edit', { property });
}));

router.put('/:id', validateProperty, catchAsync(async (req, res) => {
    const property = await Property.findByIdAndUpdate(req.params.id, {...req.body.property});
    res.redirect(`/properties/${property._id}`);
}));

router.delete('/:id', catchAsync(async (req, res) => {
    await Property.findByIdAndDelete(req.params.id);
    res.redirect('/properties');
}));

module.exports = router;