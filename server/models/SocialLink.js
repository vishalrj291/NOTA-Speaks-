const { Schema, model } = require('mongoose')

module.exports = model('SocialLink', new Schema({
  platform: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String, required: true },
}, { timestamps: true }))
