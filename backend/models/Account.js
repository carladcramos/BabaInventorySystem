const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  { collection: 'users' } // Explicitly map to 'users' collection
);

module.exports = mongoose.model('Account', accountSchema);
