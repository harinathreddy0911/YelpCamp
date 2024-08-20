const express = require('express');
const router = express.Router();
const catchAsync = require('../catchAsync');
const Campground = require('../models/campground'); 
const campgrounds =require('../controllers/campgrounds.js')
const user = require('../models/user'); 
const {campgroundSchema } =require('../validateSchema.js');
const {islogged,validateCampground} =require('../middleware.js');
const multer =require('multer');
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

const {storage} =require('../cloudinary/index.js');
const upload = multer({storage})

router.get('/camps', catchAsync(campgrounds.index));

router.post('/', islogged, upload.array('image'), validateCampground, catchAsync(campgrounds.CreateCampground));

router.get('/new', islogged,catchAsync(campgrounds.NewCampground));

router.get('/edit/:id',campgrounds.EditCampgroundDetails);
 
router.route('/:id')
    .get(campgrounds.CampgroundDetails)
    .put(islogged, catchAsync(campgrounds.EditCampground))
    .delete(islogged, campgrounds.DeleteCampground)


module.exports = router;