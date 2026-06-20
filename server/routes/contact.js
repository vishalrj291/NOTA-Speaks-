const router = require('express').Router()
const ContactMessage = require('../models/ContactMessage')

router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body
    if (!name || !email || !message) return res.status(400).json({ message: 'All fields are required' })
    await ContactMessage.create({ name, email: email.toLowerCase(), message })
    res.status(201).json({ message: 'Message received. We will get back to you soon.' })
  } catch { res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
