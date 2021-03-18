const express = require('express');
const router = express.Router();
const Property = require('../models/property');
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isAuthor, validateProperty} = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
    const properties = await Property.find({});
    res.render('properties/index', { properties });
}));

router.get('/new', isLoggedIn, async (req, res) => {
    res.render('properties/new');
});

router.post('/', isLoggedIn, validateProperty, catchAsync(async (req, res) => {
    const property = new Property(req.body.property);
    property.author = req.user._id;
    await property.save();
    req.flash('success', 'Successfully made a new Property');
    res.redirect(`/properties/${property._id}`)
}));

router.get('/:id', catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id).populate({
        path: 'helps',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(property);
    if (!property) {
        req.flash('error', 'Cannot find that Property');
        return res.redirect('/properties')
    }
    res.render('properties/show', { property });
}));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
        req.flash('error', 'Cannot find that Property');
        return res.redirect('/properties')
    }
    res.render('properties/edit', { property });
}));

router.put('/:id', isLoggedIn, isAuthor, validateProperty, catchAsync(async (req, res) => {
    const property = await Property.findByIdAndUpdate(req.params.id, {...req.body.property});
    req.flash('success', 'Successfully updated the Property');
    res.redirect(`/properties/${property._id}`);
}));

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    await Property.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the Property')
    res.redirect('/properties');
}));

module.exports = router;