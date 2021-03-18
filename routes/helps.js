const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params so that route can access property ID
const Property = require('../models/property');
const Help = require('../models/help');
const { helpSchema} = require('../schemas.js');

const EError = require('../utils/EError');
const catchAsync = require('../utils/catchAsync');

const validateHelp = (req, res, next) => {
    const {error} = helpSchema.validate(req.body);
    if(error) {
        const msg = error.detailts.map(el => el.message).join(',')
        throw new EError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateHelp, catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    const help = new Help(req.body.help);
    property.helps.push(help);
    await help.save();
    await property.save();
    res.redirect(`/properties/${property._id}`);
}));

router.delete('/:helpId', catchAsync(async (req, res) => {
    const {id, helpId} = req.params;
    await Property.findByIdAndUpdate(id, {$pull: {helps: helpId}});
    await Help.findByIdAndDelete(helpId);
    res.redirect(`/properties/${id}`);
}));

module.exports = router;

