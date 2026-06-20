const router = require('express').Router()
const SocialLink = require('../models/SocialLink')
const auth = require('../middleware/auth')

// GET all (public)
router.get('/', async (req, res) => {
  try { res.json(await SocialLink.find()) }
  catch { res.status(500).json({ message: 'Server error' }) }
})

// PUT update all (admin)
router.put('/', auth, async (req, res) => {
  try {
    const { links } = req.body
    if (!Array.isArray(links)) return res.status(400).json({ message: 'Links array required' })

    // Replace all existing links
    await SocialLink.deleteMany({})
    const created = await SocialLink.insertMany(links.filter(l => l.url))

    res.json(created)
  } catch (e) { res.status(500).json({ message: 'Server error' }) }
})

module.exports = router
