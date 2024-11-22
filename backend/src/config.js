const mongoose = require('mongoose');

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost:27017/loginapp')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Define the admin schema
const AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    },
    password: {
        type: String,
        required: true
    }
});

// Create a model for the admins collection
const collections = mongoose.model('users', AdminSchema);

module.exports = collections;