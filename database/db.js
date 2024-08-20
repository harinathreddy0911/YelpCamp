const mongoose = require('mongoose');

const uri = 'mongodb+srv://Harinathreddy:Test123@cluster0.t0aevfa.mongodb.net/Campground_Database?retryWrites=true&w=majority&appName=Cluster0';

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log("Mongo connection open!!!");
    } catch (err) {
        console.log("Error connecting to DB");
        console.log(err.message);
    }
};

module.exports = connectDB;