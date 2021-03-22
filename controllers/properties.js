const Property = require('../models/property');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({accessToken: mapBoxToken})

module.exports.index = async (req, res) => {
    const properties = await Property.find().sort({'price': 1});
    const sortedRevenue = await Property.find().sort({'revenue': 1});
    res.render('properties/index', { properties, sortedRevenue });
}

module.exports.newForm = async (req, res) => {
    res.render('properties/new');
}

module.exports.createProperty = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.property.location,
        limit: 1
    }).send();
    const property = new Property(req.body.property);
    property.geometry = geoData.body.features[0].geometry;
    property.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    property.author = req.user._id;
    await property.save();
    req.flash('success', 'Successfully made a new Property');
    res.redirect(`/properties/${property._id}`)
}

module.exports.showProperty = async (req, res) => {
    const property = await Property.findById(req.params.id).populate({
        path: 'helps',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!property) {
        req.flash('error', 'Cannot find that Property');
        return res.redirect('/properties')
    }
    res.render('properties/show', { property });
}

module.exports.editForm = async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (!property) {
        req.flash('error', 'Cannot find that Property');
        return res.redirect('/properties')
    }
    res.render('properties/edit', { property });
}

module.exports.updateProperty = async (req, res) => {
    const property = await Property.findByIdAndUpdate(req.params.id, { ...req.body.property });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    property.images.push(...imgs);
    await property.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await property.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated the Property');
    res.redirect(`/properties/${property._id}`);
}

module.exports.deleteProperty = async (req, res) => {
    await Property.findByIdAndDelete(req.params.id);
    req.flash('success', 'Successfully deleted the Property')
    res.redirect('/properties');
}