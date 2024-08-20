const mongoose =require('mongoose');
const Schema =mongoose.Schema;
const Review =require('../models/reviews');
const { func, string, required } = require('joi');
const { coordinates } = require('@maptiler/client');

const CampgroundSchema =new Schema({
    title:String,
    price:Number,
    geometry: {
        type: {
          type: String,
          enum: ['Point'],
          required: true
        },
        coordinates: {
          type: [Number],
          required: true
        }  
      },
    imageUrl:[
        {
            url:String,
            filename:String
        }
    ],
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
});

CampgroundSchema.post('findOneAndDelete',async function (doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})

Campground = mongoose.model('Campground',CampgroundSchema,'Campground');
module.exports = Campground