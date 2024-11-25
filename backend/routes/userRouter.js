const express = require('express');
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.put('/update', authMiddleware, async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const userId = req.user; // From JWT token

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update user information
    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = password;

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
