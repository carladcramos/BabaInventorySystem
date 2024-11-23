const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const collections = require('./config'); // MongoDB connection and model file

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/loginapp')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// Render the login page
app.get('/', (req, res) => {
    const error = req.query.error; // Pass error from query params, if any
    res.render('login', { error });
});

// Handle login POST request
app.post('/users', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user in the database
        const adminUser = await collections.findOne({ email: email.trim() });

        if (!adminUser || adminUser.password !== password.trim()) {
            // Redirect back to login with an error message
            return res.redirect('/?error=Invalid email or password.');
        }

        // On successful login, redirect to the dashboard
        return res.redirect('/dashboard.html');
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error.');
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).send('Something broke!');
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
