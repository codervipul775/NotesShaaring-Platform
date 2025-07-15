const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  username: { type: String, default: 'admin', unique: true },
  passwordHash: { type: String, required: true }
});

module.exports = mongoose.model('Admin', adminSchema); 