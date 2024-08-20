// const mongoose = require('mongoose');

// const reviewSchema = new mongoose.Schema({
//     body:String,
//     rating:Number,
//     author:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'user'
//     }
// });

//module.exports = mongoose.model("Review", reviewSchema)

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema);