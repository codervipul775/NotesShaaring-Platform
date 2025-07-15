const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, default: 'admin' },
  password: { type: String, required: true }, // Store hashed password
});

module.exports = mongoose.model('Admin', adminSchema); 