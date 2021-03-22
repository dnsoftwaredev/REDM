const express = require('express');
const router = express.Router({ mergeParams: true }); //merge params so that route can access property ID
const Property = require('../models/property');
const Help = require('../models/help');
const helps = require('../controllers/helps');
const {isLoggedIn, isHelpAuthor, validateHelp} = require('../middleware');

const catchAsync = require('../utils/catchAsync');

router.post('/', isLoggedIn, validateHelp, catchAsync(helps.createHelp));

router.delete('/:helpId', isLoggedIn, isHelpAuthor, catchAsync(helps.deleteHelp));

router.post('/:helpId/upvote', isLoggedIn, catchAsync(helps.upvoteHelp));

router.post('/:helpId/downvote', isLoggedIn, catchAsync(helps.downvoteHelp));

module.exports = router;

