const Property = require('../models/property');
const Help = require('../models/help');

module.exports.createHelp = async (req, res) => {
    const property = await Property.findById(req.params.id);
    const help = new Help(req.body.help);
    help.author = req.user._id;
    help.vote = 0;
    property.helps.push(help);
    await help.save();
    await property.save();
    req.flash('success', 'Created a new helpful comment');
    res.redirect(`/properties/${property._id}`);
}

module.exports.deleteHelp = async (req, res) => {
    const {id, helpId} = req.params;
    await Property.findByIdAndUpdate(id, {$pull: {helps: helpId}});
    await Help.findByIdAndDelete(helpId);
    req.flash('success', 'Successfully deleted an unhelpful comment');
    res.redirect(`/properties/${id}`);
}

module.exports.upvoteHelp = async (req, res) => {
    const help = await Help.findById(req.params.helpId);
    const property = await Property.findById(req.params.id);
    help.vote = help.vote + 1;
    await help.save();
    res.redirect(`/properties/${property.id}`);
}

module.exports.downvoteHelp = async (req, res) => {
    const help = await Help.findById(req.params.helpId);
    const property = await Property.findById(req.params.id);
    help.vote = help.vote - 1;
    await help.save();
    res.redirect(`/properties/${property.id}`);
}