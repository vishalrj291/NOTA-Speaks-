const { Schema, model } = require('mongoose')

module.exports = model('JoinRequest', new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  mobile: { type: String, required: true },
  state: { type: String, required: true },
  profession: { type: String, required: true },
  interests: [{ type: String }],
  message: { type: String, default: '' },
  agreedToValues: { type: Boolean, default: true },
  otpVerified: { type: Boolean, default: false },
}, { timestamps: true }))
