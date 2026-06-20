const { Schema, model } = require('mongoose')
const bcrypt = require('bcryptjs')

const adminSchema = new Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true })

adminSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.passwordHash)
}

module.exports = model('Admin', adminSchema)
