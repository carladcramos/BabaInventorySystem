const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const collections = require('./config'); // Ensure this is your MongoDB connection and model file

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Set the views directory correctly

// Connect to MongoDB without deprecated options
mongoose.connect('mongodb://localhost:27017/loginapp')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Serve the login page at the root URL
app.get('/', (req, res) => {
    console.log('Received a request to the root URL');
    res.render('login', { user: null }); // Pass user as null
});

// Handle login POST request
app.post('/users', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.redirect('/?error=Please enter both email and password.');
        }

        // Find the admin user in the database
        const adminUser = await collections.findOne({ email: email.trim() });

        if (!adminUser) {
            return res.redirect('/?error=Invalid email or password.');
        }

        // Check if the password matches
        if (adminUser.password === password.trim()) {
            // Successful login
            return res.redirect('/dashboard?success=Login successful!');
        } else {
            return res.redirect('/?error=Invalid email or password.');
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack);
    res.status(500).send('Something broke!');
});

// Serve static files (CSS, JS, etc.)
app.use(express.static(path.join(__dirname, 'public')));

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});