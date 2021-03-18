const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params so that route can access property ID
const Property = require('../models/property');
const Help = require('../models/help');
const {isLoggedIn, isHelpAuthor, validateHelp} = require('../middleware');

const EError = require('../utils/EError');
const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateHelp, catchAsync(async (req, res) => {
    const property = await Property.findById(req.params.id);
    const help = new Help(req.body.help);
    help.author = req.user._id;
    property.helps.push(help);
    await help.save();
    await property.save();
    req.flash('success', 'Created a new helpful comment');
    res.redirect(`/properties/${property._id}`);
}));

router.delete('/:helpId', isLoggedIn, isHelpAuthor, catchAsync(async (req, res) => {
    const {id, helpId} = req.params;
    await Property.findByIdAndUpdate(id, {$pull: {helps: helpId}});
    await Help.findByIdAndDelete(helpId);
    req.flash('success', 'Successfully deleted an unhelpful comment');
    res.redirect(`/properties/${id}`);
}));

module.exports = router;

