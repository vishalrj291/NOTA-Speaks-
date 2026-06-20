const router = require('express').Router()
const jwt = require('jsonwebtoken')
const Admin = require('../models/Admin')

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

    const admin = await Admin.findOne({ email: email.toLowerCase() })
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await admin.comparePassword(password)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET || 'nota_speaks_secret_key_2025',
      { expiresIn: '7d' }
    )

    res.json({ token, admin: { id: admin._id, email: admin.email } })
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Server error' })
  }
})

module.exports = router
