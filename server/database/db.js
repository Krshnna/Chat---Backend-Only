const mongoose = require("mongoose");

exports.connectDB = () => {
    mongoose.connect(process.env.MONGO_URI).then((con) => {
        console.log(`MongoDB connected`);
    }).catch((err) => console.log("Error connecting to database"));
}