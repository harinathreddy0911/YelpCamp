const Campground = require('../models/campground'); 
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;
const user = require('../models/user.js');

module.exports.index =async (req, res) => {
    const camps = await Campground.find({});
    res.render('campgrounds/campground', { camps });
}

module.exports.NewCampground = async(req, res) => {
    res.render('campgrounds/NewCampground');
}

module.exports.CreateCampground = async (req, res) => {
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    
    if (!geoData.features || geoData.features.length === 0) {
        req.flash('error', 'Location not found');
        return res.redirect('back');
    }
    
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.features[0].geometry;
    console.log('Campground Geometry:', camp.geometry);
    
    camp.imageUrl = req.files.map(f => ({ url: f.path, filename: f.filename }));
    camp.author = req.user._id;

    try {
        console.log('Campground to be saved:', camp);
        await camp.save();
        console.log('Saved Campground:', camp);
        req.flash('success', "Successfully made a new campground");
        res.redirect(`/campground/${camp._id}`);
    } catch (error) {
        console.error('Error saving campground:', error);
        req.flash('error', 'Failed to save the campground.');
        res.redirect('back');
    }
}

module.exports.CampgroundDetails = async (req, res) => {
    try {
        const camp = await Campground.findById(req.params.id)
            .populate({
                path: 'reviews',
                populate: {
                    path: 'author',
                    model: 'user' // assuming 'User' is the model name for authors
                }
            })
            .populate('author');

        console.log(camp);

        if (!camp) {
            req.flash('error', 'Cannot find that campground');
            return res.redirect('/campground/camps');
        }
        res.render('campgrounds/Campdetails', { camp });
    } catch (err) {
        res.status(400).send('Invalid Campground ID');
    }
};


module.exports.EditCampground = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    camp.geometry = geoData.features[0].geometry;
    if (!camp.author.equals(req.user._id)) {  // Use 'equals' instead of 'equal'
        req.flash('error', 'You do not have permission to do that');
        return res.redirect(`/campground/camps`);  // Corrected route
    }
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Successfully updated campground');
    res.redirect(`/campgrounds/${campground._id}`);  // Corrected route
}

module.exports.DeleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campground/camps');
}

module.exports.EditCampgroundDetails =  async (req, res) => {
    try {
        const campdetails = await Campground.findById(req.params.id);
        if(!campdetails){
            req.flash('error','Cannot find that campground');
            return res.redirect('/campground/camps')
        }
        res.render('campgrounds/edit', { campdetails });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
}