const Property = require('../models/property');
const Help = require('../models/help');

module.exports.createHelp = async (req, res) => {
    const property = await Property.findById(req.params.id);
    const help = new Help(req.body.help);
    help.author = req.user._id;
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