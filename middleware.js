const {propertySchema, helpSchema} = require('./schemas.js');
const EError = require('./utils/EError');
const Property = require('./models/property');
const Help = require('./models/help');

module.exports.isLoggedIn = (req, res, next) => { // middleware to help specifying if a user is currently logged in
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // help remember last place so can redirect user back after login
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateProperty = (req, res, next) => {
    const {error} = propertySchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new EError(msg, 400)
    } else {
        next();
    }
}

module.exports.validateHelp = (req, res, next) => {
    const {error} = helpSchema.validate(req.body);
    if(error) {
        const msg = error.detailts.map(el => el.message).join(',')
        throw new EError(msg, 400)
    } else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    const property = await Property.findById(req.params.id);
    if (!property.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/properties/${req.params.id}`);
    }
    next();
}

module.exports.isHelpAuthor = async (req, res, next) => {
    const help = await Help.findById(req.params.helpId);
    if(!help.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/properties/${req.params.id}`);
    }
    next();
}