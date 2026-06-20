const router = require('express').Router()
const rateLimit = require('express-rate-limit')
const crypto = require('crypto')
const OTPRecord = require('../models/OTPRecord')
const JoinRequest = require('../models/JoinRequest')
const { sendOTP, sendWelcome } = require('../utils/mailer')

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 5,
  message: { message: 'Too many OTP requests. Please wait 10 minutes.' }
})

// POST /api/join/send-otp
router.post('/send-otp', otpLimiter, async (req, res) => {
  try {
    const { email } = req.body
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ message: 'Invalid email address' })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    const sessionId = crypto.randomBytes(16).toString('hex')

    // Delete any existing OTP for this email
    await OTPRecord.deleteMany({ email: email.toLowerCase() })

    // Save new OTP
    await OTPRecord.create({ email: email.toLowerCase(), otp, sessionId })

    // Send email
    await sendOTP(email, otp)

    res.json({ message: 'OTP sent successfully', sessionId })
  } catch (e) {
    console.error('OTP send error:', e)
    res.status(500).json({ message: 'Failed to send OTP. Please try again.' })
  }
})

// POST /api/join/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp, sessionId } = req.body
    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP required' })

    const record = await OTPRecord.findOne({ email: email.toLowerCase() })
    if (!record) return res.status(400).json({ message: 'OTP expired or not found. Please request a new one.' })
    if (record.otp !== otp.toString()) return res.status(400).json({ message: 'Incorrect OTP. Please check and try again.' })

    // Clean up
    await OTPRecord.deleteMany({ email: email.toLowerCase() })

    res.json({ message: 'OTP verified successfully', verified: true })
  } catch (e) {
    res.status(500).json({ message: 'Verification failed. Please try again.' })
  }
})

// POST /api/join/submit
router.post('/submit', async (req, res) => {
  try {
    const { name, email, mobile, state, profession, interests, message, agreed } = req.body
    if (!name || !email || !mobile || !state || !profession) {
      return res.status(400).json({ message: 'Required fields missing' })
    }

    const joinReq = await JoinRequest.create({
      name, email: email.toLowerCase(), mobile, state, profession,
      interests: interests || [],
      message: message || '',
      agreedToValues: agreed === true,
      otpVerified: true,
    })

    // Send welcome email (non-blocking)
    sendWelcome(email, name).catch(console.error)

    res.status(201).json({ message: 'Application submitted successfully', id: joinReq._id })
  } catch (e) {
    res.status(500).json({ message: 'Failed to submit application.' })
  }
})

module.exports = router
