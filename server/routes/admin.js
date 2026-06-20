const router = require('express').Router()
const auth = require('../middleware/auth')
const JoinRequest = require('../models/JoinRequest')
const ContactMessage = require('../models/ContactMessage')

// GET join requests (with optional filters)
router.get('/join-requests', auth, async (req, res) => {
  try {
    const filter = {}
    if (req.query.profession) filter.profession = req.query.profession
    if (req.query.state) filter.state = req.query.state
    if (req.query.interest) filter.interests = req.query.interest

    const requests = await JoinRequest.find(filter).sort({ createdAt: -1 })
    res.json(requests)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

// GET contact messages
router.get('/contacts', auth, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 })
    res.json(messages)
  } catch { res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
