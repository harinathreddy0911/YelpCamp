const {campgroundSchema } =require('./validateSchema.js');


module.exports.islogged =(req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl
        req.flash('error',"You must signed in first");
        return res.redirect('/login');
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
    const result = campgroundSchema.validate(req.body);
    const { error } = result;
    if (error) {
        res.send(error.details.map(el => el.message).join(','));
   
    } else {
        next();
    }
};

