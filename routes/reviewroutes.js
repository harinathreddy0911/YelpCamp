const express = require('express');
const router = express.Router();
const catchAsync = require('../catchAsync');
const Campground = require('../models/campground'); 
const user = require('../models/user'); 
const review = require('../controllers/reviews.js');
const {reviewSchema } =require('../validateSchema.js');
const {islogged} =require('../middleware.js');


const validateReview=(req,res,next) => {
   
    const result= reviewSchema.validate(req.body);
    console.log(result)
    const {error} = reviewSchema.validate(req.body);
    if(error){
        res.send(error.details.map(el=>el.message).join(','))
    }else{
        next();
    }

}

router.delete('/:id/reviews/:reviewId',catchAsync(review.DeleteReviews))

router.post('/:id/reviews' ,islogged,validateReview, catchAsync(review.CreateReview))

module.exports = router;
