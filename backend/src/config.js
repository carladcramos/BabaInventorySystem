const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/loginapp");

mongoose.connection.on('connected', () => {
    console.log("Connected to MongoDB");
});

mongoose.connection.on('error', (err) => {
    console.error("MongoDB connection error:", err);
});

// Define the login schema
const LoginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    }
});

// Create a model for the users collection
const collection = mongoose.model("users", LoginSchema);

module.exports = collection;