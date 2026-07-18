const mongoose = require('mongoose');

const revokedTokenSchema = new mongoose.Schema({
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true, expires: 0 },
});

module.exports = mongoose.model('RevokedToken', revokedTokenSchema);
