const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collections = require('./config');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');

// Serve the login page at the root URL
app.get('/', (req, res) => {
    res.render('login'); // Make sure you have a 'login.ejs' file in your views folder
});

// Handle login POST request
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).send('Please enter both username and password.'); // Return an error message
    }

    try {
        // Check if username exists
        const check = await collections.findOne({ username });
        if (!check) {
            return res.status(404).send('Undefined'); // User not found
        }
        
        // Compare the provided password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, check.password);
        
        if (isPasswordMatch) {
            // Redirect to the desired HTML file on successful login
            return res.sendFile(path.join(__dirname, '../public/index.html')); // Adjust path as necessary
        } else {
            return res.status(401).send('Password incorrect.');
        }
    } catch (error) {
        console.log('Error in Login', error);
        return res.status(500).send('Internal Server Error.');
    }
});

// Serve static files (if you have any, such as CSS or JS)
app.use(express.static(path.join(__dirname, '../public')));

const port = 5000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});