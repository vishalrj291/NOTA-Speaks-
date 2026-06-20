const { Schema, model } = require('mongoose')

module.exports = model('ContactMessage', new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true },
  message: { type: String, required: true },
}, { timestamps: true }))
