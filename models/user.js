const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

// const userSchema =new mongoose.Schema({
//     fullname:{
//         type:String,
//         required:true
//     },
//     email:{
//         type:String,
//         required:true,
//         unique:true
//     },
//     password:{
//         type:String,
//         required:true
//     }
// })

const userSchema =new mongoose.Schema({

    email:{
        type:String,
        required:true,
        unique:true
    }
    
})


userSchema.plugin(passportLocalMongoose);
const user= mongoose.model('user',userSchema,'Users');

module.exports =user;
