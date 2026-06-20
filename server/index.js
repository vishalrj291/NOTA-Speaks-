require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
const path = require('path')

const app = express()
const PORT = process.env.PORT || 5000

// ===== MIDDLEWARE =====
app.use(helmet({ contentSecurityPolicy: false }))
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Global rate limiter
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300,
  message: { message: 'Too many requests. Please try again later.' }
}))

// ===== DATABASE =====
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/notaspeaks', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('✅ Connected to MongoDB')
}).catch(err => {
  console.error('❌ MongoDB connection error:', err)
  process.exit(1)
})

// ===== ROUTES =====
app.use('/api/auth', require('./routes/auth'))
app.use('/api/campaigns', require('./routes/campaigns'))
app.use('/api/team', require('./routes/team'))
app.use('/api/faqs', require('./routes/faqs'))
app.use('/api/join', require('./routes/join'))
app.use('/api/contact', require('./routes/contact'))
app.use('/api/social-links', require('./routes/socialLinks'))
app.use('/api/admin', require('./routes/admin'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date() }))

// ===== ERROR HANDLER =====
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// ===== START =====
app.listen(PORT, () => console.log(`🚀 NOTA Speaks server running on port ${PORT}`))
