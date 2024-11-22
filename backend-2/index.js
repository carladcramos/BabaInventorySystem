const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/loginapp')

const express = require('express')
const app = express();

const adminRoute = require('.routes/adminRoute');
app.use('/', adminRoute)

app.listen(3000, function () {
    console.log('Server running on port 3000')
});