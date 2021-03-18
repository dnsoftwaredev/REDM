const express = require('express');
const router = express.Router();
const {propertySchema} = require('../schemas');
const EError = require('../utils/EError');
const Property = require('../models/property');
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn} = require('../middleware');

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

router.get('/new', isLoggedIn, async (req, res) => {
    res.render('properties/new');
});

router.post('/', isLoggedIn, validateProperty, catchAsync(async (req, res) => {
    const property = new Property(req.body.property);
    await property.save();
    req.flash('success', 'Successfully made a new Property');
    res.redirect(`/properties/${property._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id).populate('helps');
    if (!property) {
        req.flash('error', 'Cannot find that Property');
        return res.redirect('/properties')
    }
    res.render('properties/show', { property });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
        req.flash('error', 'Cannot find that Property');
        return res.redirect('/properties')
    }
    res.render('properties/edit', { property });
}));

router.put('/:id', isLoggedIn ,validateProperty, catchAsync(async (req, res) => {
    const property = await Property.findByIdAndUpdate(req.params.id, {...req.body.property});
    req.flash('success', 'Successfully updated the Property');
    res.redirect(`/properties/${property._id}`);
}));

router.delete('/:id',isLoggedIn ,catchAsync(async (req, res) => {
    await Property.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the Property')
    res.redirect('/properties');
}));

module.exports = router;