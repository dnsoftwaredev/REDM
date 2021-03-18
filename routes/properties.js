const express = require('express');
const router = express.Router();
const properties = require('../controllers/properties')
const Property = require('../models/property');
const catchAsync = require('../utils/catchAsync')
const {isLoggedIn, isAuthor, validateProperty} = require('../middleware');

router.get('/', catchAsync(properties.index));

router.get('/new', isLoggedIn, properties.newForm);

router.post('/', isLoggedIn, validateProperty, catchAsync(properties.createProperty));

router.get('/:id', catchAsync(properties.showProperty));

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(properties.editForm));

router.put('/:id', isLoggedIn, isAuthor, validateProperty, catchAsync(properties.updateProperty));

router.delete('/:id',isLoggedIn, isAuthor, catchAsync(properties.deleteProperty));

module.exports = router;