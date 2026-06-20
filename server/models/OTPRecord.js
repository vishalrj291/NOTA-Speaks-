const { Schema, model } = require('mongoose')

// OTP Record with TTL (auto-expires after 10 minutes)
const otpSchema = new Schema({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  sessionId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 600 }, // 10 min TTL
})

module.exports = model('OTPRecord', otpSchema)
