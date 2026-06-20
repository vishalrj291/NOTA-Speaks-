const { Schema, model } = require('mongoose')

module.exports = model('TeamMember', new Schema({
  name: { type: String, required: true, trim: true },
  role: { type: String, required: true },
  bio: { type: String, default: '' },
  photoUrl: { type: String, default: '' },
  instagram: { type: String, default: '' },
  twitter: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  order: { type: Number, default: 0 },
}, { timestamps: true }))
